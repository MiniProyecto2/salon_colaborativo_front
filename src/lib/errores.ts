import { ApiError } from "./api";

export const MENSAJE_CREDENCIALES = "Correo o contraseña incorrectos";

export function codigoFirebase(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code: unknown }).code);
  }
  return "";
}

/** Texto para el estudiante a partir de un error de Firebase Auth. Devuelve null si no hay que avisar (p. ej. cerró la ventana de Google). */
export function mensajeAuth(error: unknown): string | null {
  switch (codigoFirebase(error)) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/user-cancelled":
      return null;
    case "auth/popup-blocked":
      return "Tu navegador bloqueó la ventana de Google. Permite las ventanas emergentes de este sitio e inténtalo de nuevo.";
    case "auth/network-request-failed":
      return "No hay conexión a Internet. Revisa tu red e inténtalo de nuevo.";
    case "auth/too-many-requests":
      return "Hiciste demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
    case "auth/account-exists-with-different-credential":
      return "Ya existe una cuenta con ese correo. Inicia sesión con tu correo y contraseña.";
    case "auth/user-disabled":
      return "Esta cuenta está desactivada. Escribe al equipo de soporte.";
    case "auth/unauthorized-domain":
      return "Este sitio todavía no está autorizado para entrar con Google. Avisa al equipo del proyecto.";
    default:
      return "No pudimos completar la acción. Inténtalo de nuevo en unos momentos.";
  }
}

/** Texto para el estudiante a partir de un error de la API. */
export function mensajeApi(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.tipo === "config") return "Falta configurar la dirección del servidor (VITE_API_URL).";
    if (error.tipo === "tiempo") return "El servidor tardó demasiado en responder. Inténtalo de nuevo.";
    if (error.tipo === "red") return "No fue posible conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.";
    if (error.status === 401) return "No pudimos verificar tu sesión. Cierra sesión y vuelve a entrar.";
    if (error.status >= 500) return "El servidor tuvo un problema. Inténtalo de nuevo en unos minutos.";
  }
  return "No pudimos completar la acción. Inténtalo de nuevo.";
}
