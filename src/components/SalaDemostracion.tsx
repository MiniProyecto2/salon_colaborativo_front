import { useState } from "react";
import Icon from "./Icon";

/** Sala de ejemplo interactiva (Bienvenida y pantallas de acceso). Los controles solo simulan el aspecto. */
type Participante = {
  iniciales: string;
  nombre: string;
  avatar: string;
  icono: string;
  pantalla?: string;
};

const PARTICIPANTES: Participante[] = [
  { iniciales: "CR", nombre: "Camila R.", avatar: "bg-primary-container text-on-primary", icono: "text-primary" },
  { iniciales: "DM", nombre: "David M.", avatar: "bg-secondary text-on-secondary", icono: "text-secondary" },
  { iniciales: "ST", nombre: "Sofía T.", avatar: "bg-tertiary-container text-on-tertiary", icono: "text-primary", pantalla: "Taller_Derivadas.pdf" },
  { iniciales: "AV", nombre: "Alejandro V.", avatar: "bg-inverse-surface text-inverse-on-surface", icono: "text-on-surface" },
];

function Cuadro({ p }: { p: Participante }) {
  return (
    <li
      className={`relative rounded-xl overflow-hidden aspect-[4/3] flex flex-col justify-between p-3 ${
        p.pantalla ? "bg-surface-variant" : "bg-surface-container-high"
      }`}
    >
      <div className="flex items-center justify-between w-full z-10">
        <span aria-hidden="true" className={`w-7 h-7 rounded-full font-label text-xs font-bold flex items-center justify-center shadow-xs ${p.avatar}`}>
          {p.iniciales}
        </span>
        <div className="flex items-center gap-1">
          {p.pantalla && (
            <span className="px-1.5 py-0.5 rounded bg-secondary text-on-secondary font-body text-[11px] font-semibold">Pantalla</span>
          )}
          <span className="w-7 h-7 rounded-full bg-surface-container-lowest/90 flex items-center justify-center text-error">
            <Icon name="mic_off" className="text-[16px]" />
            <span className="sr-only">Micrófono silenciado</span>
          </span>
        </div>
      </div>

      <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center pointer-events-none">
        {p.pantalla ? (
          <>
            <Icon name="integration_instructions" className="text-[32px] text-primary mb-1" />
            <span className="font-mono text-xs text-on-surface-variant font-medium">{p.pantalla}</span>
          </>
        ) : (
          <Icon name="person" className={`text-[80px] opacity-10 ${p.icono}`} />
        )}
      </div>

      <div className="z-10 bg-surface-container-lowest/90 px-2.5 py-1 rounded-md self-start flex items-center gap-1.5 shadow-xs">
        <span className="font-label text-xs text-on-surface font-medium">{p.nombre}</span>
        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-secondary" />
      </div>
    </li>
  );
}

export default function SalaDemostracion() {
  const [micSilenciado, setMicSilenciado] = useState(true);
  const [camActiva, setCamActiva] = useState(true);
  const [compartiendo, setCompartiendo] = useState(true);
  const [mensajesSinLeer, setMensajesSinLeer] = useState(3);
  const [verMensaje, setVerMensaje] = useState(false);

  return (
    <section
      aria-label="Demostración de una sala de estudio"
      className="relative w-full rounded-2xl bg-surface-container-lowest shadow-md p-4 md:p-6 border border-surface-container"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-surface-container">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
          <div>
            <p className="font-headline font-semibold text-base md:text-lg text-on-background">Sala de Cálculo Multivariable</p>
            <p className="font-body text-xs text-on-surface-variant">
              ID de la sala: <span className="font-mono text-on-surface font-bold">CALC-402</span>
            </p>
          </div>
        </div>
        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label text-xs font-medium">
          <span aria-hidden="true" className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          4 participantes
        </p>
      </div>

      <ul aria-label="Participantes de la sala de ejemplo" className="grid grid-cols-2 gap-3 mb-4">
        {PARTICIPANTES.map((p) => (
          <Cuadro key={p.iniciales} p={p} />
        ))}
      </ul>

      <div role="toolbar" aria-label="Controles de la sala de ejemplo" className="bg-surface-container-low rounded-xl px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={!micSilenciado}
            aria-label={micSilenciado ? "Micrófono silenciado. Activar micrófono" : "Micrófono activo. Silenciar micrófono"}
            onClick={() => setMicSilenciado(!micSilenciado)}
            className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
              micSilenciado ? "bg-surface-container-lowest text-error hover:bg-error-container hover:text-on-error-container" : "bg-secondary text-on-secondary"
            }`}
          >
            <Icon name={micSilenciado ? "mic_off" : "mic"} className="text-[20px]" />
          </button>
          <button
            type="button"
            aria-pressed={camActiva}
            aria-label={camActiva ? "Cámara encendida. Apagar cámara" : "Cámara apagada. Encender cámara"}
            onClick={() => setCamActiva(!camActiva)}
            className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
              camActiva ? "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high" : "bg-surface-container-highest text-on-surface-variant"
            }`}
          >
            <Icon name={camActiva ? "videocam" : "videocam_off"} className="text-[20px]" />
          </button>
          <button
            type="button"
            aria-pressed={compartiendo}
            aria-label={compartiendo ? "Compartiendo pantalla. Dejar de compartir" : "Compartir pantalla"}
            onClick={() => setCompartiendo(!compartiendo)}
            className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
              compartiendo ? "bg-secondary text-on-secondary shadow-xs" : "bg-surface-container-lowest text-on-surface"
            }`}
          >
            <Icon name="screen_share" className="text-[20px]" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setVerMensaje(true);
            setMensajesSinLeer(0);
          }}
          className="min-h-[44px] min-w-[44px] px-3 rounded-lg bg-surface-container-lowest text-on-surface flex items-center gap-2 font-label text-sm hover:bg-surface-container-high transition-colors"
        >
          <Icon name="chat" className="text-[20px] text-primary" />
          <span className="font-medium">Chat</span>
          {mensajesSinLeer > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed-dim text-on-primary-fixed font-bold text-[11px]">
              {mensajesSinLeer}
              <span className="sr-only"> mensajes sin leer</span>
            </span>
          )}
        </button>
      </div>

      <div role="status">
        {verMensaje && (
          <div className="mt-3 p-3 bg-primary-fixed/50 rounded-lg text-xs text-on-primary-fixed flex items-center justify-between">
            <span>Último mensaje de Camila R.: «He compartido la solución del ejercicio 4».</span>
            <button type="button" aria-label="Cerrar mensaje" onClick={() => setVerMensaje(false)} className="min-w-[44px] min-h-[44px] -my-3 font-bold">
              <span aria-hidden="true">×</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
