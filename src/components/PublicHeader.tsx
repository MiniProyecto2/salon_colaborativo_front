import { useCallback, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSesion } from "../hooks/useSesion";
import Icon from "./Icon";
import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";

const enlaceNav = ({ isActive }: { isActive: boolean }) =>
  `min-h-[44px] px-3 inline-flex items-center font-label text-sm rounded-lg transition-colors ${
    isActive ? "text-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
  }`;

export default function PublicHeader() {
  const { fase } = useSesion();
  const haySesion = fase === "listo";
  const [menuAbierto, setMenuAbierto] = useState(false);
  const botonMenuRef = useRef<HTMLButtonElement>(null);
  const cerrar = useCallback(() => setMenuAbierto(false), []);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 md:h-20 max-w-[1200px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-xs">
          <button
            ref={botonMenuRef}
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            aria-haspopup="dialog"
            onClick={() => setMenuAbierto(true)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container"
          >
            <Icon name="menu" className="text-[24px]" />
          </button>
          <Logo to="/" />
        </div>

        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-space-sm">
          <NavLink to="/ayuda" className={enlaceNav}>Ayuda</NavLink>
          {haySesion ? (
            <Link
              to="/dashboard"
              className="min-h-[44px] px-4 inline-flex items-center justify-center font-label text-sm text-on-primary bg-primary-container hover:bg-primary transition-colors rounded-lg shadow-sm"
            >
              Ir al Panel
            </Link>
          ) : (
            <>
              <Link
                to="/iniciar-sesion"
                className="min-h-[44px] px-4 inline-flex items-center justify-center font-label text-sm text-on-surface bg-surface-container-lowest hover:bg-surface-container-low transition-colors rounded-lg shadow-sm border border-outline-variant/40"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="min-h-[44px] px-4 inline-flex items-center justify-center font-label text-sm text-on-primary bg-primary-container hover:bg-primary transition-colors rounded-lg shadow-sm"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>

      <MobileDrawer abierto={menuAbierto} onCerrar={cerrar} origenRef={botonMenuRef} />
    </header>
  );
}
