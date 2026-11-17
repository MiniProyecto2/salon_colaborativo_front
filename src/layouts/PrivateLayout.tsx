import { Outlet } from "react-router-dom";
import BarraLateral from "../components/BarraLateral";
import Footer from "../components/Footer";
import GuardiaSesion from "../components/GuardiaSesion";
import NavInferior from "../components/NavInferior";
import PrivateHeader from "../components/PrivateHeader";
import SkipLink from "../components/SkipLink";
import AvisosProvider from "../context/AvisosProvider";

// Protegido: sin sesión va a la página de inicio; sin perfil, a elegir nombre de usuario.
// Escritorio: menú lateral + encabezado. Móvil y tableta: encabezado + barra de navegación inferior.
export default function PrivateLayout() {
  return (
    <GuardiaSesion modo="privado">
      <AvisosProvider>
        <div className="min-h-screen bg-surface">
          <SkipLink />
          <BarraLateral />
          <div className="lg:pl-64 min-h-screen flex flex-col pb-20 lg:pb-0">
            <PrivateHeader />
            <main id="contenido-principal" tabIndex={-1} className="w-full flex-1 focus:outline-none">
              <Outlet />
            </main>
            <Footer />
          </div>
          <NavInferior />
        </div>
      </AvisosProvider>
    </GuardiaSesion>
  );
}
