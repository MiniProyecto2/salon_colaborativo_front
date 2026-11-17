/** Colores de las burbujas de iniciales (rotan para distinguir a los participantes). */
const TONOS = [
  "bg-primary-fixed text-on-primary-fixed",
  "bg-secondary-fixed text-on-secondary-fixed",
  "bg-tertiary-fixed text-on-tertiary-fixed",
  "bg-surface-container-highest text-on-surface-variant",
];

export const tonoIniciales = (i: number) => TONOS[i % TONOS.length];
