import { Link } from "react-router-dom";

const enlace =
  "min-h-[44px] inline-flex items-center text-on-surface-variant hover:text-on-surface hover:underline transition-colors";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest py-8 mt-12 border-t border-surface-container">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md">
        <p className="font-body text-sm text-on-surface-variant text-center md:text-left">
          © {new Date().getFullYear()} Salón de Estudio. Entorno académico digital accesible.
        </p>
        <nav aria-label="Enlaces secundarios y soporte" className="flex flex-wrap items-center justify-center gap-space-md text-sm">
          <Link to="/ayuda" className={enlace}>Ayuda</Link>
          <Link to="/diagnostico-sistema" className={enlace}>Estado del sistema</Link>
          <Link to="/accesibilidad" className={enlace}>Declaración de accesibilidad</Link>
        </nav>
      </div>
    </footer>
  );
}
