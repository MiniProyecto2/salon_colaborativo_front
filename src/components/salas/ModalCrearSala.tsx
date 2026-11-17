import { useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCopiar } from "../../hooks/useCopiar";
import { MATERIAS, MAX_DESCRIPCION_SALA, MAX_NOMBRE_SALA, crearSala, type Sala, mensajeSalas } from "../../lib/salas";
import Icon from "../Icon";
import Alert from "../ui/Alert";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import TextField from "../ui/TextField";

const SUGERENCIAS = [
  { emoji: "⚛️", texto: "Física Mecánica", nombre: "Física Mecánica - Grupo 2" },
  { emoji: "🧪", texto: "Química Orgánica", nombre: "Química Orgánica - Lab" },
  { emoji: "💻", texto: "Programación", nombre: "Programación Web" },
];

const campoSelect =
  "w-full min-h-[48px] rounded-lg bg-surface-container-lowest px-4 font-body text-base text-on-surface border border-outline";

type Fase = "formulario" | "cargando" | "error" | "exito";
type Props = { abierto: boolean; onCerrar: () => void; iniciales: string; onCreada: () => void };

function Contenido({ onCerrar, iniciales, onCreada, tituloId }: Omit<Props, "abierto"> & { tituloId: string }) {
  const copiar = useCopiar();
  const [fase, setFase] = useState<Fase>("formulario");
  const [nombre, setNombre] = useState("");
  const [materia, setMateria] = useState(MATERIAS[0]);
  const [descripcion, setDescripcion] = useState("");
  const [publica, setPublica] = useState(true);
  const [errorNombre, setErrorNombre] = useState<string | null>(null);
  const [errorEnvio, setErrorEnvio] = useState("");
  const [creada, setCreada] = useState<Sala | null>(null);
  const grupoId = useId();
  const nombreRef = useRef<HTMLInputElement>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const limpio = nombre.trim().replace(/\s+/g, " ");
    if (!limpio) {
      setErrorNombre("Escribe un nombre para la sala");
      nombreRef.current?.focus();
      return;
    }
    if (limpio.length > MAX_NOMBRE_SALA) {
      setErrorNombre(`El nombre puede tener hasta ${MAX_NOMBRE_SALA} caracteres`);
      nombreRef.current?.focus();
      return;
    }
    setErrorNombre(null);
    setFase("cargando");
    try {
      const sala = await crearSala({ nombre: limpio, materia, descripcion: descripcion.trim(), publica }, iniciales);
      setCreada(sala);
      setFase("exito");
      onCreada();
    } catch (error) {
      setErrorEnvio(mensajeSalas(error));
      setFase("error");
    }
  }

  const cabecera = (
    <div className="bg-surface-container px-space-lg py-space-md flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
          <Icon name="add_business" className="text-[20px]" />
        </span>
        <h2 id={tituloId} className="font-headline text-headline-sm font-semibold text-on-surface">
          Crear sala de estudio
        </h2>
      </div>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        disabled={fase === "cargando"}
        className="w-11 h-11 -mr-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest flex items-center justify-center disabled:opacity-50"
      >
        <Icon name="close" className="text-[22px]" />
      </button>
    </div>
  );

  if (fase === "cargando") {
    return (
      <>
        {cabecera}
        <div role="status" className="p-space-xl flex flex-col items-center text-center gap-space-md">
          <Spinner />
          <div className="flex flex-col gap-1">
            <p className="font-headline text-headline-sm font-semibold text-on-surface">Creando tu sala…</p>
            <p className="font-body text-body-sm text-on-surface-variant">Estamos generando un código único para compartir.</p>
          </div>
        </div>
      </>
    );
  }

  if (fase === "error") {
    return (
      <>
        {cabecera}
        <div className="p-space-lg flex flex-col gap-space-md">
          <Alert tipo="error" titulo="No pudimos crear la sala">
            {errorEnvio}
          </Alert>
          <div className="flex justify-end">
            <button
              type="button"
              data-autofocus
              onClick={() => setFase("formulario")}
              className="min-h-[48px] px-space-lg rounded-lg bg-primary-container text-on-primary font-label text-label-lg shadow-sm hover:bg-primary"
            >
              Modificar datos
            </button>
          </div>
        </div>
      </>
    );
  }

  if (fase === "exito" && creada) {
    return (
      <>
        {cabecera}
        <div role="status" className="p-space-xl flex flex-col items-center text-center gap-space-md">
          <span aria-hidden="true" className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <Icon name="check_circle" className="text-[36px]" />
          </span>
          <div className="flex flex-col gap-1 items-center">
            <p className="font-headline text-headline-sm font-semibold text-on-surface">¡Sala creada con éxito!</p>
            <p className="font-body text-body-sm text-on-surface-variant">Comparte este código para que se unan:</p>
            <div className="inline-flex items-center gap-2 bg-surface-container py-1.5 pl-4 pr-1 rounded-lg mt-1">
              <code className="font-headline text-headline-sm font-bold text-primary tracking-wider">{creada.id}</code>
              <button
                type="button"
                aria-label={`Copiar código ${creada.id}`}
                onClick={() => void copiar(creada.id)}
                className="w-11 h-11 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              >
                <Icon name="content_copy" className="text-[20px]" />
              </button>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row items-stretch gap-space-sm w-full mt-space-sm">
            <button
              type="button"
              onClick={onCerrar}
              className="min-h-[48px] sm:w-1/2 px-space-md rounded-lg bg-surface-container text-on-surface font-label text-label-lg hover:bg-surface-container-high"
            >
              Volver al panel
            </button>
            <Link
              to={`/salas/${creada.id}`}
              data-autofocus
              className="min-h-[48px] sm:w-1/2 px-space-md rounded-lg bg-primary-container text-on-primary font-label text-label-lg shadow-sm hover:bg-primary flex items-center justify-center gap-2"
            >
              Entrar a la sala
              <Icon name="arrow_forward" className="text-[20px]" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {cabecera}
      <form noValidate onSubmit={enviar} className="p-space-lg flex flex-col gap-space-md">
        <TextField
          ref={nombreRef}
          etiqueta="Nombre de la sala"
          nombre="room-name"
          maxLength={MAX_NOMBRE_SALA}
          ayuda={`Hasta ${MAX_NOMBRE_SALA} caracteres (${nombre.length}/${MAX_NOMBRE_SALA}).`}
          valor={nombre}
          onCambio={(v) => {
            setNombre(v);
            setErrorNombre(null);
          }}
          error={errorNombre}
        />

        <div className="flex flex-col gap-1.5">
          <span className="font-label text-label-md text-on-surface-variant">Sugerencias rápidas</span>
          <div className="flex flex-wrap gap-1.5">
            {SUGERENCIAS.map((s) => (
              <button
                key={s.nombre}
                type="button"
                onClick={() => {
                  setNombre(s.nombre);
                  setErrorNombre(null);
                }}
                className="min-h-[36px] px-3 rounded-full bg-surface-container text-on-surface font-label text-label-md hover:bg-surface-container-high transition-colors"
              >
                <span aria-hidden="true">{s.emoji} </span>
                {s.texto}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${grupoId}-materia`} className="font-label text-sm font-semibold text-on-surface">
            Materia o área de estudio
          </label>
          <select id={`${grupoId}-materia`} value={materia} onChange={(e) => setMateria(e.target.value)} className={campoSelect}>
            {MATERIAS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${grupoId}-desc`} className="font-label text-sm font-semibold text-on-surface">
            Descripción corta (opcional)
          </label>
          <textarea
            id={`${grupoId}-desc`}
            rows={2}
            maxLength={MAX_DESCRIPCION_SALA}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Resolver la guía #4 y preparar el taller del jueves."
            className="w-full rounded-lg bg-surface-container-lowest p-3 font-body text-base text-on-surface placeholder:text-outline border border-outline resize-none"
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="font-label text-sm font-semibold text-on-surface mb-1">Modalidad de la sala</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { valor: true, titulo: "Pública", texto: "Cualquiera con código" },
              { valor: false, titulo: "Solo invitados", texto: "Requiere anfitrión" },
            ].map((o) => (
              <label
                key={o.titulo}
                className="flex items-center gap-2 p-space-sm bg-surface-container-low rounded-lg cursor-pointer has-[:checked]:ring-2 has-[:checked]:ring-primary-container has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-primary-container"
              >
                <input
                  type="radio"
                  name={`${grupoId}-modalidad`}
                  checked={publica === o.valor}
                  onChange={() => setPublica(o.valor)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="flex flex-col">
                  <span className="font-label text-label-md font-semibold text-on-surface">{o.titulo}</span>
                  <span className="font-label text-label-sm text-on-surface-variant">{o.texto}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center justify-end gap-space-sm pt-space-sm">
          <button
            type="button"
            onClick={onCerrar}
            className="min-h-[48px] px-space-md rounded-lg bg-surface-container text-on-surface font-label text-label-lg hover:bg-surface-container-high"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[48px] flex-1 sm:flex-none px-space-lg rounded-lg bg-primary-container text-on-primary font-label text-label-lg shadow-sm hover:bg-primary flex items-center justify-center gap-2"
          >
            <Icon name="rocket_launch" className="text-[20px]" />
            Crear sala
          </button>
        </div>
      </form>
    </>
  );
}

export default function ModalCrearSala({ abierto, onCerrar, iniciales, onCreada }: Props) {
  const tituloId = useId();
  return (
    <Modal abierto={abierto} onCerrar={onCerrar} tituloId={tituloId} ancho="lg">
      <Contenido onCerrar={onCerrar} iniciales={iniciales} onCreada={onCreada} tituloId={tituloId} />
    </Modal>
  );
}
