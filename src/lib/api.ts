import { auth } from "../firebase/config";

/**
 * Dirección base del backend (sin /api/v1). Acepta VITE_API_URL con o sin
 * "/api/v1" al final y sin barra final, para que un error de configuración
 * no rompa todas las peticiones.
 */
export const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api\/v1$/, "");

export type DetalleCampo = { field: string; message: string };
export type TipoErrorApi = "config" | "red" | "tiempo" | "http";

export class ApiError extends Error {
  readonly tipo: TipoErrorApi;
  readonly status: number;
  readonly detalles: DetalleCampo[];

  constructor(tipo: TipoErrorApi, status = 0, mensaje = "", detalles: DetalleCampo[] = []) {
    super(mensaje || tipo);
    this.tipo = tipo;
    this.status = status;
    this.detalles = detalles;
  }
}

let alSesionInvalida: (() => void) | null = null;

/** El proveedor de sesión se registra aquí para actuar cuando el servidor rechaza el token. */
export function registrarSesionInvalida(manejador: (() => void) | null) {
  alSesionInvalida = manejador;
}

type Opciones = { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; tiempoMs?: number };

/** Petición a /api/v1 con el ID token de Firebase de la sesión actual. */
export async function apiFetch<T>(ruta: string, { method = "GET", body, tiempoMs = 45000 }: Opciones = {}): Promise<T> {
  if (!API_BASE) throw new ApiError("config");
  const usuario = auth.currentUser;
  if (!usuario) throw new ApiError("http", 401, "Sin sesión");

  const token = await usuario.getIdToken();
  const controlador = new AbortController();
  const temporizador = window.setTimeout(() => controlador.abort(), tiempoMs);

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_BASE}/api/v1${ruta}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controlador.signal,
    });
  } catch (error) {
    throw new ApiError((error as Error).name === "AbortError" ? "tiempo" : "red");
  } finally {
    window.clearTimeout(temporizador);
  }

  if (!respuesta.ok) {
    // 401: el servidor no aceptó el token (falta, venció o es de otro proyecto): la sesión no vale.
    if (respuesta.status === 401) alSesionInvalida?.();
    let cuerpo: { error?: string; details?: DetalleCampo[] } = {};
    try {
      cuerpo = await respuesta.json();
    } catch {
      /* el servidor no devolvió JSON */
    }
    throw new ApiError("http", respuesta.status, cuerpo.error ?? "", cuerpo.details ?? []);
  }
  if (respuesta.status === 204) return undefined as T;
  return (await respuesta.json()) as T;
}
