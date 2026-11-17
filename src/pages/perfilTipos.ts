import type { ReactNode } from "react";
import type { Estadisticas } from "../lib/estadisticas";
import type { Perfil } from "../lib/perfiles";

export type PerfilVistaProps = {
  perfil: Perfil;
  estadisticas: Estadisticas;
  ultimoAcceso: string | null;
  /** Cómo inicia sesión la persona («Google» o «Correo y contraseña»). */
  proveedor: string;
  editando: boolean;
  onEditar: () => void;
  onCancelarEdicion: () => void;
  onGuardado: () => void;
  onEliminarCuenta: () => void;
  /** Aviso de éxito tras guardar (o null). */
  aviso: ReactNode;
};

export const miembroDesde = (iso: string) => {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? null : fecha.toLocaleDateString("es-CO", { month: "long", year: "numeric" });
};

export const fechaLarga = (iso: string | null) => {
  if (!iso) return null;
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? null : fecha.toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" });
};
