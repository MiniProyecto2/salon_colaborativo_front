import { Link, NavLink } from "react-router-dom";
import { useEnLinea } from "../hooks/useEnLinea";
import Icon from "./Icon";
import { NAV_LATERAL } from "./navegacion";

const enlace = ({ isActive }: { isActive: boolean }) =>
  `min-h-[44px] flex items-center gap-3 px-4 py-2 rounded-lg font-label text-label-lg transition-colors ${
    isActive
      ? "bg-primary-container text-on-primary shadow-[0_1px_3px_rgba(26,27,34,0.06)]"
      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
  }`;

/** Menú lateral fijo de las pantallas privadas en escritorio. */
export default function BarraLateral() {
  const enLinea = useEnLinea();
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-full w-64 flex-col justify-between py-4 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-6">
        <Link to="/dashboard" className="flex items-center gap-3 px-6 rounded-lg focus-visible:outline-offset-0">
          <span aria-hidden="true" className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.05)] text-primary-container">
            <Icon name="menu_book" className="text-[24px]" />
          </span>
          <span>
            <span className="block font-headline text-headline-sm text-on-surface leading-tight">Salón de Estudio</span>
            <span className="block font-label text-label-sm text-on-surface-variant">Plataforma Académica</span>
          </span>
        </Link>
        <nav aria-label="Navegación del panel" className="flex flex-col gap-2 px-4">
          {NAV_LATERAL.map((item) => (
            <NavLink key={item.to} to={item.to} className={enlace}>
              <Icon name={item.icono} className="text-[20px]" />
              {item.texto}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-4">
        <Link
          to="/diagnostico-sistema"
          className="block bg-surface-container-lowest rounded-lg p-3 shadow-[0_1px_3px_rgba(26,27,34,0.04)] hover:bg-surface-container-low transition-colors"
        >
          <span className="flex items-center gap-2 mb-1">
            <span aria-hidden="true" className={`w-2 h-2 rounded-full ${enLinea ? "bg-secondary animate-pulse" : "bg-error"}`} />
            <span className="font-label text-label-sm font-semibold text-on-surface">{enLinea ? "Servicio disponible" : "Sin conexión"}</span>
          </span>
          <span className="flex items-center justify-between font-label text-label-sm text-on-surface-variant">
            <span className="text-secondary font-medium">Estado del sistema</span>
            <span className="bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded-full text-[10px] font-semibold">WCAG 2.2 AA</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
