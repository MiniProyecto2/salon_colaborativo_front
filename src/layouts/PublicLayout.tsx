import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import PublicHeader from "../components/PublicHeader";
import Alert from "../components/ui/Alert";
import { useSesion } from "../hooks/useSesion";
import SkipLink from "../components/SkipLink";

export default function PublicLayout() {
  const { avisoSesion, descartarAvisoSesion } = useSesion();
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SkipLink />
      <PublicHeader />
      <main id="contenido-principal" tabIndex={-1} className="w-full flex-1 focus:outline-none">
        {avisoSesion && (
          <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin pt-4">
            <Alert tipo="error" titulo="Tu sesión se cerró" onCerrar={descartarAvisoSesion}>
              {avisoSesion}
            </Alert>
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
