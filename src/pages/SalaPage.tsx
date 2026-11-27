import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, type Socket } from "socket.io-client";
import PantallaEnConstruccion from "../components/PantallaEnConstruccion";
import RoomHeader from "../components/RoomHeader";
import ModalEliminarSala from "../components/salas/ModalEliminarSala";
import ModalRenombrarSala from "../components/salas/ModalRenombrarSala";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import { useAvisos } from "../hooks/useAvisos";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useSesion } from "../hooks/useSesion";
import { mostrarSala, URL_TIEMPO_REAL, type SalaApi } from "../lib/salas";

const ERROR_CONEXION = "No pudimos conectarte a la sala. Revisa tu conexión e inténtalo de nuevo.";
const ERROR_HISTORIAL = "No pudimos cargar el historial. Vuelve a intentarlo.";
const ERROR_ENVIO = "No pudimos enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.";
const hora = new Intl.DateTimeFormat("es-CO", { hour: "2-digit", minute: "2-digit" });

type SalaActiva = SalaApi & { anfitrion: boolean };
type Participante = { uid: string; nombre: string };
type Cursor = { id: string; seconds: number; nanoseconds: number };
type Mensaje = Participante & { id: string; texto: string; fecha: string; cursor: Cursor };
type Pagina = { mensajes: Mensaje[]; hayAnteriores: boolean };
type Historial = { pagina?: Pagina | null; error?: string };

function ordenar(actuales: Mensaje[], nuevos: Mensaje[]) {
  return [...new Map([...actuales, ...nuevos].map((mensaje) => [mensaje.id, mensaje])).values()]
    .sort((a, b) => a.cursor.seconds - b.cursor.seconds || a.cursor.nanoseconds - b.cursor.nanoseconds
      || (a.id < b.id ? -1 : Number(a.id > b.id)));
}

function InteriorSala({ id }: { id: string }) {
  const { usuario } = useSesion();
  const { mostrar } = useAvisos();
  const navegar = useNavigate();
  const [sala, setSala] = useState<SalaActiva | null>(null);
  const [estado, setEstado] = useState<"cargando" | "conectado" | "error">("cargando");
  const [error, setError] = useState(ERROR_CONEXION);
  const [personas, setPersonas] = useState<Participante[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [errorHistorial, setErrorHistorial] = useState<string | null>(null);
  const [borrador, setBorrador] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [hayNuevos, setHayNuevos] = useState(false);
  const [modal, setModal] = useState<"editar" | "eliminar" | null>(null);
  const conexion = useRef<Socket | null>(null);
  const chat = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const cercaDelFinal = useRef(true);
  const alturaAnterior = useRef(0);
  const pendiente = useRef<{ id: string; texto: string } | null>(null);
  useDocumentTitle(sala?.nombre ?? `Sala ${id}`);

  useEffect(() => {
    if (!URL_TIEMPO_REAL || !usuario) return;
    const socket = io(URL_TIEMPO_REAL, {
      autoConnect: false,
      forceNew: true,
      timeout: 12000,
      auth: (callback) => {
        void usuario.getIdToken().then((token) => callback({ token }), () => callback({ token: "" }));
      },
    });
    conexion.current = socket;

    function fallar(texto = ERROR_CONEXION) {
      setError(texto);
      setEstado("error");
      setPersonas([]);
      setCargandoHistorial(false);
    }

    socket.on("connect", () => {
      setEstado("cargando");
      setCargandoHistorial(true);
      setErrorHistorial(null);
      setCursor(null);
      socket.timeout(15000).emit("room:join", id, (fallo: Error | null, respuesta: Historial) => {
        if (!socket.connected || fallo) {
          if (fallo && socket.connected) {
            socket.disconnect();
            fallar();
          }
          return;
        }
        if (respuesta.error) {
          socket.disconnect();
          fallar(respuesta.error);
          return;
        }
        setEstado("conectado");
        setCargandoHistorial(false);
        if (respuesta.pagina) {
          const { mensajes: lista, hayAnteriores } = respuesta.pagina;
          setMensajes((previos) => ordenar(previos, lista));
          setCursor(hayAnteriores ? lista[0].cursor : null);
        } else setErrorHistorial(ERROR_HISTORIAL);
      });
    });
    socket.on("room:updated", setSala);
    socket.on("room:participants", setPersonas);
    socket.on("room:message", (mensaje: Mensaje) => {
      if (mensaje.uid !== usuario.uid && !cercaDelFinal.current) setHayNuevos(true);
      setMensajes((previos) => ordenar(previos, [mensaje]));
    });
    socket.on("room:closed", () => {
      mostrar("El anfitrión eliminó la sala.", "info");
      navegar("/dashboard", { replace: true });
    });
    socket.on("room:error", (texto: string) => { socket.disconnect(); fallar(texto); });
    socket.on("connect_error", () => fallar());
    socket.on("disconnect", (motivo) => {
      if (motivo === "io client disconnect") return;
      fallar();
      if (motivo === "io server disconnect") socket.connect();
    });
    socket.connect();
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      conexion.current = null;
    };
  }, [id, mostrar, navegar, usuario]);

  useLayoutEffect(() => {
    const panel = chat.current;
    if (!panel) return;
    if (alturaAnterior.current) {
      panel.scrollTop += panel.scrollHeight - alturaAnterior.current;
      alturaAnterior.current = 0;
    } else if (cercaDelFinal.current) panel.scrollTop = panel.scrollHeight;
  }, [mensajes]);

  function bajar() {
    if (chat.current) chat.current.scrollTop = chat.current.scrollHeight;
    cercaDelFinal.current = true;
    setHayNuevos(false);
  }

  function cargar(antes: Cursor | null) {
    if (cargandoHistorial || estado !== "conectado") return;
    setCargandoHistorial(true);
    setErrorHistorial(null);
    conexion.current?.timeout(12000).emit("room:history", antes, (fallo: Error | null, respuesta: Historial) => {
      setCargandoHistorial(false);
      if (fallo || !respuesta.pagina) {
        setErrorHistorial(ERROR_HISTORIAL);
        return;
      }
      const { mensajes: lista, hayAnteriores } = respuesta.pagina;
      if (antes && chat.current) alturaAnterior.current = chat.current.scrollHeight;
      setMensajes((previos) => ordenar(previos, lista));
      setCursor(hayAnteriores ? lista[0].cursor : null);
    });
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const texto = borrador.trim();
    if (!texto || enviando || estado !== "conectado" || !conexion.current) return;
    if (pendiente.current?.texto !== texto) pendiente.current = { id: crypto.randomUUID(), texto };
    setEnviando(true);
    setErrorEnvio(null);
    conexion.current.timeout(12000).emit("room:send", pendiente.current,
      (fallo: Error | null, respuesta: { mensaje?: Mensaje; error?: string }) => {
        setEnviando(false);
        if (fallo || !respuesta.mensaje) {
          setErrorEnvio(fallo ? ERROR_ENVIO : respuesta.error ?? ERROR_ENVIO);
          return;
        }
        pendiente.current = null;
        setBorrador((actual) => actual.trim() === texto ? "" : actual);
        const mensaje = respuesta.mensaje;
        bajar();
        setMensajes((previos) => ordenar(previos, [mensaje]));
        campo.current?.focus();
      });
  }

  const tarjeta = "min-w-0 rounded-xl border border-outline-variant bg-surface-container-lowest p-space-md";
  const datosModal = sala ? { ...mostrarSala(sala), presentes: personas.length } : null;

  return (
    <>
      <RoomHeader id={id} nombre={sala?.nombre} />
      <div className="mx-auto max-w-[1200px] p-margin-mobile md:p-margin flex flex-col gap-space-md">
        {estado === "error" ? (
          <Alert tipo="error" titulo="Sin conexión con la sala">
            <span className="block mb-2">{error}</span>
            <Button variante="secondary" onClick={() => { setEstado("cargando"); conexion.current?.connect(); }}>Volver a conectar</Button>
          </Alert>
        ) : (
          <p role="status" className="font-label text-sm text-secondary">
            {estado === "cargando" ? "Conectando a la sala…" : "Conectado a la sala"}
          </p>
        )}
        {sala && (
          <div className="grid gap-space-md lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <section className={tarjeta} aria-labelledby="titulo-chat">
              <h2 id="titulo-chat" className="mb-3 font-headline text-xl font-semibold">Chat</h2>
              {cursor && <Button variante="secondary" disabled={estado !== "conectado"} cargando={cargandoHistorial} textoCargando="Cargando historial…" onClick={() => cargar(cursor)}>Cargar mensajes anteriores</Button>}
              {errorHistorial && (
                <Alert tipo="error" titulo={errorHistorial}>
                  <Button variante="secondary" disabled={estado !== "conectado"} onClick={() => cargar(cursor)}>Reintentar</Button>
                </Alert>
              )}
              {cargandoHistorial && !cursor && <p role="status" className="my-2 text-sm">Cargando historial…</p>}
              <div
                ref={chat}
                role="log"
                aria-label="Mensajes de la sala"
                tabIndex={0}
                className="my-3 h-60 overflow-auto rounded-lg bg-surface-container-low p-space-sm md:h-80"
                onScroll={(event) => {
                  const panel = event.currentTarget;
                  cercaDelFinal.current = panel.scrollHeight - panel.scrollTop - panel.clientHeight < 48;
                  if (cercaDelFinal.current) setHayNuevos(false);
                }}
              >
                {!cargandoHistorial && !errorHistorial && !mensajes.length && <p>Aún no hay mensajes. Envía el primero.</p>}
                {mensajes.length > 0 && (
                  <ol className="flex flex-col gap-space-xs">
                    {mensajes.map((mensaje) => {
                      const propio = mensaje.uid === usuario?.uid;
                      return (
                        <li key={mensaje.id} className={`max-w-[90%] rounded-lg p-space-sm wrap-anywhere ${propio ? "self-end bg-primary-fixed" : "self-start bg-surface-container-lowest"}`}>
                          <p className="text-sm text-on-surface-variant">
                            <strong>{mensaje.nombre}{propio ? " (tú)" : ""}</strong>{" · "}
                            <time dateTime={mensaje.fecha}>{hora.format(new Date(mensaje.fecha))}</time>
                          </p>
                          <p className="whitespace-pre-wrap">{mensaje.texto}</p>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
              {hayNuevos && <Button variante="secondary" onClick={bajar}>Mensajes nuevos</Button>}
              <form noValidate onSubmit={enviar} className="flex flex-col items-start gap-space-xs">
                <div className="w-full">
                  <TextField ref={campo} etiqueta="Mensaje" ayuda="Presiona Enter para enviar." valor={borrador} autoComplete="off"
                    onCambio={(valor) => { setBorrador(valor); setErrorEnvio(null); }} maxLength={1000} error={errorEnvio} />
                </div>
                <span role="status" className="sr-only">{enviando ? "Enviando mensaje…" : errorEnvio}</span>
                <Button type="submit" icono="send" cargando={enviando} textoCargando="Enviando…"
                  disabled={estado !== "conectado" || !borrador.trim()}>Enviar</Button>
              </form>
            </section>
            <div className="flex flex-col gap-space-md">
              <section className={tarjeta} aria-labelledby="titulo-participantes">
                <h2 id="titulo-participantes" className="font-headline text-xl font-semibold">Participantes</h2>
                <p role="status" className="my-2 text-sm text-on-surface-variant">
                  {estado === "cargando" ? "Cargando participantes…" : personas.length ? `${personas.length} en la sala` : "No hay participantes conectados."}
                </p>
                <ul className="space-y-2">
                  {personas.map((persona) => (
                    <li key={persona.uid} className="rounded-lg bg-surface-container-low p-space-xs wrap-anywhere">
                      {persona.nombre}{persona.uid === usuario?.uid ? " (tú)" : ""}
                    </li>
                  ))}
                </ul>
              </section>
              {sala.anfitrion && (
                <section className={tarjeta} aria-labelledby="titulo-anfitrion">
                  <h2 id="titulo-anfitrion" className="mb-3 font-headline text-xl font-semibold">Acciones del anfitrión</h2>
                  <div className="flex flex-wrap gap-space-xs">
                    <Button variante="secondary" icono="edit" onClick={() => setModal("editar")}>Editar nombre</Button>
                    <Button variante="secondary" icono="delete" className="text-error" onClick={() => setModal("eliminar")}>Eliminar sala</Button>
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
      <ModalRenombrarSala sala={modal === "editar" ? datosModal : null} onCerrar={() => setModal(null)} onGuardada={() => {}} />
      <ModalEliminarSala sala={modal === "eliminar" ? datosModal : null} onCerrar={() => setModal(null)} onEliminada={() => navegar("/dashboard", { replace: true })} />
    </>
  );
}

export default function SalaPage() {
  const { id = "" } = useParams();
  if (!URL_TIEMPO_REAL) {
    return <PantallaEnConstruccion titulo={`Sala ${id}`.trim()} sprint={3}
      descripcion="Aquí estarán el chat y los participantes de la sala."
      volverA={{ to: "/dashboard", texto: "Volver al panel" }} />;
  }
  return <InteriorSala key={id} id={id} />;
}
