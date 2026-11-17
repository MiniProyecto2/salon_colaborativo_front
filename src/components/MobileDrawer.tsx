import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSesion } from "../hooks/useSesion";
import Icon from "./Icon";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  /** Botón que abrió el menú: el foco vuelve ahí al cerrar. */
  origenRef: React.RefObject<HTMLButtonElement | null>;
};

const itemNav =
  "min-h-[44px] flex items-center px-space-md rounded-lg font-body font-semibold text-sm text-on-surface hover:bg-surface-container";

const FOCUSABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileDrawer({ abierto, onCerrar, origenRef }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const { fase } = useSesion();
  const haySesion = fase === "listo";

  // Cierra el menú al cambiar de ruta
  useEffect(() => {
    onCerrar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Foco dentro del diálogo, Esc para cerrar, trampa de foco y retorno al botón de origen
  useEffect(() => {
    if (!abierto) return;
    const origen = origenRef.current;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLES)?.focus();

    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLES));
      const primero = items[0];
      const ultimo = items[items.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", alPulsar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = "";
      origen?.focus();
    };
  }, [abierto, onCerrar, origenRef]);

  if (!abierto) return null;

  return (
    <div className="relative z-50 md:hidden">
      <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onCerrar} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="fixed inset-y-0 left-0 max-w-[320px] w-full bg-surface-container-lowest p-space-lg shadow-2xl flex flex-col justify-between"
      >
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-2 text-primary">
              <Icon name="menu_book" className="text-[28px]" />
              <span className="font-headline font-semibold text-lg tracking-tight">Salón de Estudio</span>
            </div>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={onCerrar}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container"
            >
              <Icon name="close" />
            </button>
          </div>

          <nav aria-label="Navegación móvil" className="flex flex-col gap-1 mt-2">
            <Link to="/" className={itemNav}>
              <Icon name="home" className="mr-3 text-primary text-[20px]" />
              Bienvenida
            </Link>
            <Link to="/ayuda" className={itemNav}>
              <Icon name="help_outline" className="mr-3 text-on-surface-variant text-[20px]" />
              Ayuda
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-xl">
          {haySesion ? (
            <Link
              to="/dashboard"
              className="w-full min-h-[48px] px-space-md rounded-lg bg-primary text-on-primary font-body font-semibold text-sm shadow-sm flex items-center justify-center gap-space-xs"
            >
              <span>Ir al Panel</span>
              <Icon name="arrow_forward" className="text-[20px]" />
            </Link>
          ) : (
            <>
              <Link
                to="/registro"
                className="w-full min-h-[48px] px-space-md rounded-lg bg-primary text-on-primary font-body font-semibold text-sm shadow-sm flex items-center justify-center gap-space-xs"
              >
                <span>Registrarse</span>
                <Icon name="arrow_forward" className="text-[20px]" />
              </Link>
              <Link
                to="/iniciar-sesion"
                className="w-full min-h-[48px] px-space-md rounded-lg bg-surface-container-lowest text-primary font-body font-semibold text-sm shadow-sm flex items-center justify-center"
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
