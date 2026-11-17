import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";

export type AccionMenu = { texto: string; icono: string; onClick: () => void; peligro?: boolean };

/** Menú «más opciones» de una tarjeta. Esc y clic fuera lo cierran; el foco vuelve al botón. */
export default function MenuAcciones({ etiqueta, acciones }: { etiqueta: string; acciones: AccionMenu[] }) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    contenedorRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
      }
    };
    const alHacerClic = (e: MouseEvent) => {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("keydown", alPulsar);
    document.addEventListener("mousedown", alHacerClic);
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.removeEventListener("mousedown", alHacerClic);
    };
  }, [abierto]);

  return (
    <div ref={contenedorRef} className="relative">
      <button
        ref={botonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label={etiqueta}
        onClick={() => setAbierto((v) => !v)}
        className="w-11 h-11 -mr-2 -mt-2 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
      >
        <Icon name="more_vert" className="text-[22px]" />
      </button>
      {abierto && (
        <div
          role="menu"
          aria-label={etiqueta}
          className="absolute right-0 mt-1 w-48 bg-surface-container-lowest rounded-lg shadow-xl py-1 z-20 border border-surface-container"
        >
          {acciones.map((a) => (
            <button
              key={a.texto}
              type="button"
              role="menuitem"
              onClick={() => {
                setAbierto(false);
                a.onClick();
              }}
              className={`w-full min-h-[44px] text-left px-4 py-2 font-label text-label-lg flex items-center gap-2 ${
                a.peligro ? "text-error hover:bg-error-container" : "text-on-surface hover:bg-surface-container"
              }`}
            >
              <Icon name={a.icono} className="text-[18px]" />
              {a.texto}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
