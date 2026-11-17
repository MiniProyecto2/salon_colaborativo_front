/**
 * Datos de demostración.
 *
 * El backend todavía no expone salas ni estadísticas de estudio, así que el Panel y el Perfil
 * muestran datos de ejemplo (tomados de los prototipos de Stitch) para poder ver el diseño completo.
 * Cuando exista la API, pon VITE_DATOS_DEMO=false y reemplaza las funciones de `lib/salas.ts`
 * y `lib/estadisticas.ts` por llamadas a `apiFetch`.
 */
export const DATOS_DEMO = (import.meta.env.VITE_DATOS_DEMO as string | undefined) !== "false";

/** Pausa corta para que los estados de carga se vean como en un servidor real. */
export const esperar = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
