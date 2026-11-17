import { useState } from "react";
import Alert from "../components/ui/Alert";
import ModalCrearSala from "../components/salas/ModalCrearSala";
import ModalEliminarSala from "../components/salas/ModalEliminarSala";
import ModalRenombrarSala from "../components/salas/ModalRenombrarSala";
import { useAvisos } from "../hooks/useAvisos";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useMisSalas } from "../hooks/useMisSalas";
import { useSesion } from "../hooks/useSesion";
import type { Sala } from "../lib/salas";
import DashboardEscritorio from "./DashboardEscritorio";
import DashboardMovil from "./DashboardMovil";
import { MAX_SALAS } from "./panelTipos";

function iniciales(nombre: string) {
  return nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0] ?? "").join("").toUpperCase() || "?";
}

export default function DashboardPage() {
  useDocumentTitle("Panel");
  const { perfil, cuentaNueva, descartarBienvenida } = useSesion();
  const { mostrar } = useAvisos();
  const esMovil = useMediaQuery("(max-width: 1023px)"); // mismo corte que el menú lateral ("lg")
  const { estado, salas, reintentar, refrescar } = useMisSalas();
  const [creando, setCreando] = useState(false);
  const [renombrando, setRenombrando] = useState<Sala | null>(null);
  const [eliminando, setEliminando] = useState<Sala | null>(null);

  if (!perfil) return null; // el guardia de sesión ya garantiza el perfil

  const primerNombre = perfil.displayName.split(" ")[0];
  const limiteAlcanzado = salas.length >= MAX_SALAS;

  const props = {
    primerNombre,
    estado,
    salas,
    limiteAlcanzado,
    onCrear: () => (limiteAlcanzado ? mostrar(`Alcanzaste el máximo de ${MAX_SALAS} salas. Elimina una para crear otra.`, "info") : setCreando(true)),
    onRenombrar: setRenombrando,
    onEliminar: setEliminando,
    onReintentar: reintentar,
  };

  return (
    <>
      {cuentaNueva && (
        <div className="w-full max-w-7xl mx-auto px-margin-mobile lg:px-space-xl pt-space-md lg:pt-space-xl">
          <Alert tipo="exito" titulo="Cuenta creada" onCerrar={descartarBienvenida}>
            Te damos la bienvenida, {primerNombre}. Ya puedes usar el Salón de Estudio.
          </Alert>
        </div>
      )}

      {esMovil ? <DashboardMovil {...props} /> : <DashboardEscritorio {...props} />}

      <ModalCrearSala abierto={creando} onCerrar={() => setCreando(false)} iniciales={iniciales(perfil.displayName)} onCreada={() => void refrescar()} />
      <ModalRenombrarSala sala={renombrando} onCerrar={() => setRenombrando(null)} onGuardada={() => void refrescar()} />
      <ModalEliminarSala sala={eliminando} onCerrar={() => setEliminando(null)} onEliminada={() => void refrescar()} />
    </>
  );
}
