import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import { NAV_INFERIOR } from "./navegacion";

/** Barra de navegación inferior de las pantallas privadas en móvil y tableta. */
export default function NavInferior() {
  return (
    <nav
      aria-label="Navegación principal"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-1px_8px_rgba(26,27,34,0.06)] pb-safe"
    >
      <ul className="flex items-stretch justify-around">
        {NAV_INFERIOR.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `min-h-[64px] flex flex-col items-center justify-center gap-0.5 font-label text-label-md transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`px-4 py-1 rounded-full transition-colors ${isActive ? "bg-primary-fixed" : ""}`}
                  >
                    <Icon name={item.icono} className="text-[24px] block" />
                  </span>
                  {item.textoCorto}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
