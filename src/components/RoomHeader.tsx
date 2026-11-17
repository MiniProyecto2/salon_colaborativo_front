import { Link, useParams } from "react-router-dom";
import Icon from "./Icon";

/** Encabezado dentro de la Sala: sin navegación general para evitar salidas accidentales. */
export default function RoomHeader() {
  const { id } = useParams();

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-[1200px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
        <div className="min-w-0">
          <p className="font-headline font-semibold text-base md:text-lg text-on-surface truncate">Nombre de la sala</p>
          <p className="font-label text-xs text-on-surface-variant truncate">
            ID de la sala: <span className="font-mono font-semibold text-on-surface">{id}</span>
          </p>
        </div>
        <div className="flex items-center gap-space-xs shrink-0">
          {/* Sprint 3: copia el ID al portapapeles y anuncia la confirmación */}
          <button
            type="button"
            className="min-h-[44px] px-3 inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest font-label text-sm text-on-surface hover:bg-surface-container-low"
          >
            <Icon name="content_copy" className="text-[18px]" />
            <span className="hidden sm:inline">Copiar ID</span>
            <span className="sm:hidden sr-only">Copiar ID</span>
          </button>
          <Link
            to="/dashboard"
            className="min-h-[44px] px-4 inline-flex items-center gap-2 rounded-lg bg-error text-on-error font-label text-sm font-semibold hover:opacity-90"
          >
            <Icon name="logout" className="text-[18px]" />
            Salir de la sala
          </Link>
        </div>
      </div>
    </header>
  );
}
