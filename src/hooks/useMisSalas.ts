import { useCallback, useEffect, useState } from "react";
import { listarMisSalas, type Sala } from "../lib/salas";

export type EstadoSalas = "cargando" | "error" | "listo";

/**
 * Salas del usuario con sus estados (cargando, error, vacío, con salas).
 * Solo en desarrollo, `?estado=cargando|error|vacio` fuerza ese estado para revisar el diseño.
 */
export function useMisSalas() {
  const [estado, setEstado] = useState<EstadoSalas>("cargando");
  const [salas, setSalas] = useState<Sala[]>([]);
  const [intento, setIntento] = useState(0);

  const forzado = import.meta.env.DEV ? new URLSearchParams(window.location.search).get("estado") : null;

  useEffect(() => {
    if (forzado) return;
    let vigente = true;
    listarMisSalas()
      .then((lista) => {
        if (!vigente) return;
        setSalas(lista);
        setEstado("listo");
      })
      .catch(() => vigente && setEstado("error"));
    return () => {
      vigente = false;
    };
  }, [intento, forzado]);

  const reintentar = useCallback(() => {
    setEstado("cargando");
    setIntento((n) => n + 1);
  }, []);

  /** Vuelve a leer la lista sin mostrar el estado de carga (tras crear, renombrar o eliminar). */
  const refrescar = useCallback(async () => setSalas(await listarMisSalas()), []);

  if (forzado === "cargando") return { estado: "cargando" as const, salas: [] as Sala[], reintentar, refrescar };
  if (forzado === "error") return { estado: "error" as const, salas: [] as Sala[], reintentar, refrescar };
  if (forzado === "vacio") return { estado: "listo" as const, salas: [] as Sala[], reintentar, refrescar };
  return { estado, salas, reintentar, refrescar };
}
