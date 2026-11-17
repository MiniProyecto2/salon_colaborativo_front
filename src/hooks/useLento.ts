import { useEffect, useState } from "react";

/** true si una operación lleva más de `ms` en curso (el servidor gratuito tarda en despertar). */
export function useLento(activo: boolean, ms = 2500) {
  const [lento, setLento] = useState(false);

  useEffect(() => {
    if (!activo) return;
    const temporizador = window.setTimeout(() => setLento(true), ms);
    return () => {
      window.clearTimeout(temporizador);
      setLento(false);
    };
  }, [activo, ms]);

  return lento;
}
