import { useState } from "react";
import ModalEliminarCuenta from "../components/perfil/ModalEliminarCuenta";
import Alert from "../components/ui/Alert";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useSesion } from "../hooks/useSesion";
import { obtenerEstadisticas } from "../lib/estadisticas";
import PerfilEscritorio from "./PerfilEscritorio";
import PerfilMovil from "./PerfilMovil";

export default function PerfilPage() {
  useDocumentTitle("Mi perfil");
  const { perfil, usuario } = useSesion();
  const esMovil = useMediaQuery("(max-width: 1023px)"); // mismo corte que el menú lateral ("lg")
  const [editando, setEditando] = useState(false);
  const [exito, setExito] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  if (!perfil) return null; // el guardia de sesión ya garantiza el perfil

  const props = {
    perfil,
    estadisticas: obtenerEstadisticas(),
    ultimoAcceso: usuario?.metadata.lastSignInTime ?? null,
    proveedor: perfil.provider === "google.com" || perfil.provider === "google" ? "Google" : "Correo y contraseña",
    editando,
    onEditar: () => {
      setExito(false);
      setEditando(true);
    },
    onCancelarEdicion: () => setEditando(false),
    onGuardado: () => {
      setEditando(false);
      setExito(true);
    },
    onEliminarCuenta: () => setEliminando(true),
    aviso: exito ? (
      <Alert tipo="exito" titulo="Perfil actualizado" onCerrar={() => setExito(false)}>
        Tus cambios ya están guardados y se verán en tus salas de estudio.
      </Alert>
    ) : null,
  };

  return (
    <>
      {esMovil ? <PerfilMovil {...props} /> : <PerfilEscritorio {...props} />}
      <ModalEliminarCuenta abierto={eliminando} perfil={perfil} onCerrar={() => setEliminando(false)} />
    </>
  );
}
