import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useEnLinea } from "../hooks/useEnLinea";
import { useSesion } from "../hooks/useSesion";
import Icon from "./Icon";
import Avatar from "./ui/Avatar";

const enlaceNav = ({ isActive }: { isActive: boolean }) =>
  `min-h-[44px] px-3 inline-flex items-center rounded-lg font-label text-label-lg transition-colors ${
    isActive ? "bg-primary-container text-on-primary" : "text-on-surface-variant hover:text-on-surface"
  }`;

const itemMenu =
  "w-full min-h-[44px] px-4 flex items-center gap-3 text-left font-body text-sm text-on-surface hover:bg-surface-container";

const SUBTITULOS: Record<string, string> = {
  "/dashboard": "Panel",
  "/perfil": "Perfil",
  "/mis-salas": "Mis salas",
  "/pizarra": "Pizarra",
  "/recursos": "Recursos",
};

/** Encabezado de las pantallas privadas: quién tiene la sesión, estado de conexión y cierre de sesión. */
export default function PrivateHeader() {
  const { perfil, salir } = useSesion();
  const enLinea = useEnLinea();
  const { pathname } = useLocation();
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
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

  const primerNombre = perfil?.displayName.split(" ")[0] ?? "";

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-margin-mobile lg:px-space-xl flex items-center justify-between gap-space-md">
        {/* Móvil: marca y sección actual */}
        <Link to="/dashboard" className="lg:hidden flex items-center gap-3 min-w-0 rounded-lg">
          <span aria-hidden="true" className="w-10 h-10 shrink-0 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
            <Icon name="school" className="text-[24px]" />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="font-headline text-headline-sm text-on-surface truncate leading-tight">Salón de Estudio</span>
            <span className="font-label text-label-sm text-on-surface-variant truncate">{SUBTITULOS[pathname] ?? "Panel"}</span>
          </span>
        </Link>

        {/* Escritorio: título y enlaces principales */}
        <div className="hidden lg:flex items-center gap-space-xl">
          <span className="font-headline text-headline-sm text-on-surface">Salón de Estudio</span>
          <nav aria-label="Navegación principal" className="flex items-center gap-space-xs">
            <NavLink to="/dashboard" className={enlaceNav}>Panel</NavLink>
            <NavLink to="/ayuda" className={enlaceNav}>Ayuda</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-space-xs lg:gap-space-md shrink-0">
          <span
            role="status"
            className="hidden sm:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full"
          >
            <span aria-hidden="true" className={`w-2 h-2 rounded-full ${enLinea ? "bg-secondary" : "bg-error"}`} />
            <span className="font-label text-label-sm text-on-surface-variant">{enLinea ? "Conectado" : "Sin conexión"}</span>
          </span>

          <Link
            to="/ayuda"
            aria-label="Ayuda y soporte"
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface"
          >
            <Icon name="help" className="text-[24px]" />
          </Link>

          <div ref={contenedorRef} className="relative">
            <button
              ref={botonRef}
              type="button"
              aria-expanded={abierto}
              aria-haspopup="menu"
              aria-label="Menú de usuario"
              onClick={() => setAbierto((v) => !v)}
              className="min-h-[44px] pl-1 pr-1 lg:pr-3 inline-flex items-center gap-space-sm rounded-full hover:bg-surface-container"
            >
              <span className="hidden sm:block text-right pl-3">
                <span className="block font-label text-label-lg text-on-surface leading-tight">{primerNombre}</span>
                <span className="block font-label text-label-sm text-on-surface-variant leading-tight">@{perfil?.username}</span>
              </span>
              <Avatar src={perfil?.photoURL} nombre={perfil?.displayName ?? ""} tamano="sm" />
            </button>

            {abierto && (
              <div
                role="menu"
                aria-label="Opciones de usuario"
                className="absolute right-0 mt-2 w-52 py-2 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container"
              >
                <Link role="menuitem" to="/perfil" className={itemMenu} onClick={() => setAbierto(false)}>
                  <Icon name="account_circle" className="text-[20px] text-primary" />
                  Mi perfil
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  className={itemMenu}
                  onClick={() => {
                    setAbierto(false);
                    void salir(); // cierra la sesión y lleva a Bienvenida
                  }}
                >
                  <Icon name="logout" className="text-[20px] text-on-surface-variant" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
