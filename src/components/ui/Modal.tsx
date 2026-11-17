import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  /** id del elemento que titula el diálogo (aria-labelledby). */
  tituloId: string;
  descripcionId?: string;
  /** Mientras es true no se cierra con Esc ni al pulsar fuera (p. ej. durante una operación). */
  bloqueado?: boolean;
  /** Ancho máximo en escritorio. */
  ancho?: "md" | "lg";
  children: ReactNode;
};

/**
 * Diálogo modal accesible: foco dentro, Esc para cerrar, trampa de foco, y el foco vuelve al botón
 * que lo abrió. En móvil se muestra como hoja inferior; en escritorio, centrado.
 */
export default function Modal({ abierto, onCerrar, tituloId, descripcionId, bloqueado = false, ancho = "md", children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef(onCerrar);
  const bloqueadoRef = useRef(bloqueado);
  useEffect(() => {
    cerrarRef.current = onCerrar;
    bloqueadoRef.current = bloqueado;
  });

  useEffect(() => {
    if (!abierto) return;
    const origen = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const primero = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel?.querySelector<HTMLElement>(FOCUSABLES);
    primero?.focus();

    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !bloqueadoRef.current) {
        e.stopPropagation();
        cerrarRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLES));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const ini = items[0];
      const fin = items[items.length - 1];
      if (e.shiftKey && document.activeElement === ini) {
        e.preventDefault();
        fin.focus();
      } else if (!e.shiftKey && document.activeElement === fin) {
        e.preventDefault();
        ini.focus();
      }
    };
    document.addEventListener("keydown", alPulsar);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = overflow;
      origen?.focus?.();
    };
  }, [abierto]);

  if (!abierto) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      <div
        className="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={() => !bloqueado && onCerrar()}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={descripcionId}
        className={`relative w-full ${
          ancho === "lg" ? "lg:max-w-lg" : "lg:max-w-md"
        } max-h-[92vh] overflow-y-auto bg-surface-container-lowest rounded-t-2xl lg:rounded-2xl shadow-2xl lg:m-4 pb-safe`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
