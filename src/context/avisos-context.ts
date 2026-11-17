import { createContext } from "react";

export type TipoAviso = "exito" | "error" | "info";
export type Avisos = { mostrar: (mensaje: string, tipo?: TipoAviso) => void };

export const AvisosContext = createContext<Avisos | null>(null);
