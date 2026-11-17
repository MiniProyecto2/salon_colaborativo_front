/** Modo opcional para revisar el diseño con datos de ejemplo en desarrollo. */
export const DATOS_DEMO = import.meta.env.DEV && import.meta.env.VITE_DATOS_DEMO === "true";

/** Pausa corta para que los estados de carga se vean como en un servidor real. */
export const esperar = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
