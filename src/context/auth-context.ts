import { createContext } from "react";
import type { User } from "firebase/auth";
import type { Perfil } from "../lib/perfiles";

/**
 * cargando     → todavía no sabemos si hay sesión (primera carga de la página)
 * sin-sesion   → nadie ha iniciado sesión
 * verificando  → hay sesión de Firebase y se consulta el perfil en la API
 * sin-perfil   → hay sesión pero falta elegir el nombre de usuario
 * listo        → sesión y perfil completos
 * error        → hay sesión pero no se pudo consultar el perfil
 */
export type FaseSesion = "cargando" | "sin-sesion" | "verificando" | "sin-perfil" | "listo" | "error";

export type Sesion = {
  fase: FaseSesion;
  /** true si hay un usuario de Firebase con sesión abierta (con o sin perfil). */
  haySesion: boolean;
  usuario: User | null;
  perfil: Perfil | null;
  errorPerfil: string | null;
  /** Motivo por el que se cerró la sesión sin que la persona lo pidiera (token rechazado). */
  avisoSesion: string | null;
  descartarAvisoSesion: () => void;
  /** true justo después de crear la cuenta: el Panel muestra el aviso de bienvenida. */
  cuentaNueva: boolean;
  /** true mientras se cierra la sesión (se muestra «Cerrando sesión…»). */
  saliendo: boolean;
  /** Cierra la sesión y lleva a `destino` (por defecto, Bienvenida). */
  salir: (destino?: string) => Promise<void>;
  recargarPerfil: () => void;
  guardarPerfil: (perfil: Perfil, opciones?: { cuentaNueva?: boolean }) => void;
  descartarBienvenida: () => void;
};

export const SesionContext = createContext<Sesion | null>(null);
