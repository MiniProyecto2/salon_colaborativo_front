import { useContext } from "react";
import { SesionContext } from "../context/auth-context";

/** Estado de la sesión (Firebase Auth + perfil de la API). Requiere <AuthProvider>. */
export function useSesion() {
  const sesion = useContext(SesionContext);
  if (!sesion) throw new Error("useSesion debe usarse dentro de <AuthProvider>");
  return sesion;
}
