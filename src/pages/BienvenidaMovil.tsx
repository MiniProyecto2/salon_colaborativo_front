import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

type Mosaico = {
  iniciales: string;
  nombre: string;
  avatar: string;
  microActivo: boolean;
  pantalla?: string;
};

const MOSAICOS: Mosaico[] = [
  { iniciales: "CR", nombre: "Camila R.", avatar: "bg-primary-container text-on-primary", microActivo: false },
  { iniciales: "DM", nombre: "David M.", avatar: "bg-secondary text-on-secondary", microActivo: false },
  { iniciales: "ST", nombre: "Sofía T.", avatar: "bg-tertiary-container text-on-tertiary", microActivo: true, pantalla: "Taller.pdf" },
  { iniciales: "AV", nombre: "Alejandro V.", avatar: "bg-inverse-surface text-inverse-on-surface", microActivo: true },
];

const FUNCIONES = [
  {
    icono: "chat",
    fondo: "bg-surface-container-highest text-primary",
    titulo: "Chat de la sala",
    subtitulo: "Intercambio ágil y ordenado",
    texto: "Escribe y recupera el historial de la conversación. Comparte fórmulas y apuntes sin perder el hilo.",
    etiqueta: "Historial sincronizado",
    etiquetaIcono: "done_all",
    etiquetaColor: "text-primary",
  },
  {
    icono: "videocam",
    fondo: "bg-secondary-container text-on-secondary-container",
    titulo: "Video y audio",
    subtitulo: "Directo en tu navegador",
    texto: "Mira y escucha a tu grupo en tiempo real, desde el celular o el computador y sin instalar nada.",
    etiqueta: "Audio y video en vivo",
    etiquetaIcono: "signal_cellular_alt",
    etiquetaColor: "text-secondary",
  },
  {
    icono: "screen_share",
    fondo: "bg-primary-fixed text-on-primary-fixed-variant",
    titulo: "Compartir pantalla",
    subtitulo: "Desde el computador",
    texto: "Presenta guías de laboratorio, diapositivas o código a todo el grupo desde tu computador.",
    etiqueta: "Una persona presenta a la vez",
    etiquetaIcono: "devices",
    etiquetaColor: "text-primary-container",
  },
];

const DATOS = [
  { icono: "accessibility_new", fondo: "bg-secondary-container text-on-secondary-container", color: "text-secondary", titulo: "Accesible", texto: "Pensado para lectores de pantalla y teclado (WCAG 2.2 AA)." },
  { icono: "bolt", fondo: "bg-surface-container-highest text-primary", color: "text-primary", titulo: "En tiempo real", texto: "Chat y video sincronizados para todos los participantes." },
  { icono: "cloud_done", fondo: "bg-surface-container-high text-on-surface", color: "text-on-surface", titulo: "0 descargas", texto: "Todo en tu navegador, sin llenar el almacenamiento." },
];

function Tesela({ m }: { m: Mosaico }) {
  return (
    <li className="relative aspect-video rounded-lg overflow-hidden bg-surface-container-high flex items-center justify-center">
      {m.pantalla ? (
        <div aria-hidden="true" className="flex flex-col items-center">
          <Icon name="integration_instructions" className="text-[28px] text-primary" />
          <span className="font-mono text-[10px] text-on-surface-variant">{m.pantalla}</span>
        </div>
      ) : (
        <span aria-hidden="true" className={`w-10 h-10 rounded-full font-label text-sm font-bold flex items-center justify-center ${m.avatar}`}>
          {m.iniciales}
        </span>
      )}

      {m.pantalla && (
        <span className="absolute top-1 left-1 bg-primary text-on-primary px-1.5 py-0.5 rounded text-[10px] font-semibold">Pantalla</span>
      )}

      <div className="absolute inset-x-1 bottom-1 flex items-center justify-between bg-surface-container-lowest/90 rounded-md px-1.5 py-0.5">
        <span className="font-label text-xs text-on-surface truncate">{m.nombre}</span>
        <span className={m.microActivo ? "text-secondary" : "text-error"}>
          <Icon name={m.microActivo ? "mic" : "mic_off"} className="text-[16px]" />
          <span className="sr-only">{m.microActivo ? "Micrófono activo" : "Micrófono silenciado"}</span>
        </span>
      </div>
    </li>
  );
}

function SalaDemostracion() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [presentando, setPresentando] = useState(true);
  const [sinLeer, setSinLeer] = useState(3);

  const boton = "min-w-[44px] min-h-[44px] flex flex-col items-center justify-center rounded-lg transition-colors";

  return (
    <section
      aria-label="Demostración de una sala de estudio"
      className="flex flex-col rounded-xl bg-surface-container-lowest shadow-md border border-surface-container overflow-hidden mb-8"
    >
      <div className="bg-surface-container-low px-4 py-3 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <p className="font-headline font-semibold text-sm text-on-surface">Cálculo Multivariable</p>
          </div>
          <p className="font-label text-xs text-on-surface-variant">ID de la sala: CALC-402</p>
        </div>
        <p className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs font-semibold">
          <Icon name="group" className="text-[16px]" />
          4 participantes
        </p>
      </div>

      <ul aria-label="Participantes de la sala de ejemplo" className="p-2 grid grid-cols-2 gap-2">
        {MOSAICOS.map((m) => (
          <Tesela key={m.iniciales} m={m} />
        ))}
      </ul>

      <div role="toolbar" aria-label="Controles de la sala de ejemplo" className="bg-surface-container-low px-4 py-2 flex items-center justify-around gap-1">
        <button
          type="button"
          aria-pressed={mic}
          aria-label={mic ? "Micrófono activo. Silenciar micrófono" : "Micrófono silenciado. Activar micrófono"}
          onClick={() => setMic(!mic)}
          className={`${boton} ${mic ? "text-primary font-semibold" : "text-error"}`}
        >
          <Icon name={mic ? "mic" : "mic_off"} className="text-[20px]" />
          <span className="font-label text-[11px]">{mic ? "Audio" : "Silencio"}</span>
        </button>
        <button
          type="button"
          aria-pressed={cam}
          aria-label={cam ? "Cámara encendida. Apagar cámara" : "Cámara apagada. Encender cámara"}
          onClick={() => setCam(!cam)}
          className={`${boton} ${cam ? "text-on-surface" : "text-on-surface-variant"}`}
        >
          <Icon name={cam ? "videocam" : "videocam_off"} className="text-[20px]" />
          <span className="font-label text-[11px]">Cámara</span>
        </button>
        <button
          type="button"
          aria-pressed={presentando}
          aria-label={presentando ? "Presentando. Dejar de presentar" : "Presentar pantalla"}
          onClick={() => setPresentando(!presentando)}
          className={`${boton} ${presentando ? "text-primary font-semibold" : "text-on-surface-variant"}`}
        >
          <Icon name="present_to_all" className="text-[20px]" />
          <span className="font-label text-[11px]">Presentar</span>
        </button>
        <button
          type="button"
          aria-label={sinLeer > 0 ? `Chat, ${sinLeer} mensajes sin leer` : "Chat"}
          onClick={() => setSinLeer(0)}
          className={`relative ${boton} text-on-surface-variant hover:text-on-surface`}
        >
          <Icon name="chat_bubble" className="text-[20px]" />
          <span className="font-label text-[11px]">Chat{sinLeer > 0 ? ` (${sinLeer})` : ""}</span>
          {sinLeer > 0 && <span aria-hidden="true" className="absolute top-1 right-2 w-2 h-2 bg-error rounded-full" />}
        </button>
      </div>
    </section>
  );
}

export default function BienvenidaMovil() {
  return (
    <div className="flex flex-col w-full max-w-[680px] mx-auto px-margin-mobile pt-6 pb-4">
      {/* Hero */}
      <section aria-labelledby="hero-titulo" className="flex flex-col gap-3 mb-6">
        <p className="inline-flex items-center gap-1.5 self-start py-1 px-3 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs font-semibold">
          <Icon name="school" className="text-[16px]" />
          Entorno universitario colaborativo
        </p>

        <h1 id="hero-titulo" className="font-headline text-2xl sm:text-3xl text-on-background font-bold tracking-tight">
          Estudia con tu grupo, como en un salón real
        </h1>

        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          Crea una sala, chatea, habla por video y comparte tu pantalla en tiempo real, con accesibilidad para todas las personas.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            to="/registro"
            className="w-full min-h-[48px] rounded-lg bg-primary text-on-primary font-body font-semibold text-sm shadow-sm flex items-center justify-center gap-2 active:bg-primary-container transition-colors"
          >
            Registrarse
            <Icon name="arrow_forward" className="text-[20px]" />
          </Link>
          <Link
            to="/iniciar-sesion"
            className="w-full min-h-[48px] rounded-lg bg-surface-container-lowest text-on-surface font-body font-semibold text-sm border border-outline-variant shadow-sm flex items-center justify-center hover:bg-surface-container"
          >
            Iniciar sesión
          </Link>
        </div>

        <ul className="flex flex-wrap items-center gap-2 pt-1">
          <li className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-surface-container-high text-on-surface font-label text-xs">
            <Icon name="check_circle" className="text-[16px] text-secondary" />
            Accesibilidad WCAG 2.2 AA
          </li>
          <li className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-surface-container-high text-on-surface font-label text-xs">
            <Icon name="bolt" className="text-[16px] text-primary" />
            Tiempo real
          </li>
        </ul>
      </section>

      <SalaDemostracion />

      {/* Funciones */}
      <section aria-labelledby="funciones-titulo" className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <p className="font-label text-xs text-primary tracking-wide font-semibold">Herramientas esenciales</p>
          <h2 id="funciones-titulo" className="font-headline font-semibold text-xl text-on-surface">¿Qué puedes hacer?</h2>
          <p className="font-body text-xs text-on-surface-variant">
            Diseñado para concentrarte en el aprendizaje, sin interfaces saturadas ni caídas de red.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {FUNCIONES.map((f) => (
            <li key={f.titulo}>
              <article className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div aria-hidden="true" className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${f.fondo}`}>
                    <Icon name={f.icono} className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-sm text-on-surface">{f.titulo}</h3>
                    <p className="font-label text-xs text-on-surface-variant">{f.subtitulo}</p>
                  </div>
                </div>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">{f.texto}</p>
                <p className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-surface-container font-label text-xs self-start ${f.etiquetaColor}`}>
                  <Icon name={f.etiquetaIcono} className="text-[14px]" />
                  {f.etiqueta}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Datos clave */}
      <section aria-labelledby="datos-titulo" className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Icon name="speed" className="text-primary text-[22px]" />
          <h2 id="datos-titulo" className="font-headline font-semibold text-base text-on-surface">Pensado para estudiar</h2>
        </div>
        <ul className="flex flex-col gap-2">
          {DATOS.map((d) => (
            <li key={d.titulo} className="p-3 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-3">
              <div aria-hidden="true" className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${d.fondo}`}>
                <Icon name={d.icono} className="text-[18px]" />
              </div>
              <div>
                <p className={`font-headline font-semibold text-sm ${d.color}`}>{d.titulo}</p>
                <p className="font-body text-xs text-on-surface-variant">{d.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
