import { useState } from "react";
import { iniciarConGoogle } from "../lib/autenticacion";
import { mensajeAuth } from "../lib/errores";

/** Abre la ventana de Google. Si algo falla, avisa con `onError`; si cierra la ventana, no molesta. */
export function useAccesoGoogle(onError: (mensaje: string) => void) {
  const [cargando, setCargando] = useState(false);

  async function acceder() {
    setCargando(true);
    try {
      await iniciarConGoogle(); // el guardia de sesión lleva a la pantalla que corresponde
    } catch (error) {
      const mensaje = mensajeAuth(error);
      if (mensaje) onError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return { cargando, acceder };
}
