import { Outlet } from "react-router-dom";
import GuardiaSesion from "../components/GuardiaSesion";
import SkipLink from "../components/SkipLink";

// La Sala no lleva pie de página ni navegación general (ver mapa del sitio, sección B).
export default function RoomLayout() {
  return (
    <GuardiaSesion modo="privado">
      <div className="min-h-screen flex flex-col bg-surface">
        <SkipLink />
        <main id="contenido-principal" tabIndex={-1} className="w-full flex-1 focus:outline-none">
          <Outlet />
        </main>
      </div>
    </GuardiaSesion>
  );
}
