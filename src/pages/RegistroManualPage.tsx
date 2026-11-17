import { Navigate } from "react-router-dom";

/** Ruta anterior: el registro con correo ahora vive en /registro. */
export default function RegistroManualPage() {
  return <Navigate to="/registro" replace />;
}
