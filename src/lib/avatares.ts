export type Avatar = {
  id: string;
  archivo: string;
  /** Nombre corto que se ve bajo el ícono. */
  etiqueta: string;
  descripcion: string;
  /** Ícono de Material Symbols y colores del recuadro (mismos que el archivo SVG). */
  icono: string;
  fondo: string;
  texto: string;
};

/** Avatares temáticos disponibles (archivos en /public/avatars). */
export const AVATARES: Avatar[] = [
  { id: "calculo", archivo: "calculo.svg", etiqueta: "Cálculo", descripcion: "Calculadora sobre fondo azul", icono: "calculate", fondo: "bg-primary-container", texto: "text-on-primary" },
  { id: "codigo", archivo: "codigo.svg", etiqueta: "Código", descripcion: "Símbolo de código sobre fondo turquesa", icono: "code", fondo: "bg-secondary-fixed", texto: "text-on-secondary-fixed-variant" },
  { id: "ciencias", archivo: "ciencias.svg", etiqueta: "Ciencias", descripcion: "Matraz de laboratorio sobre fondo durazno", icono: "science", fondo: "bg-tertiary-fixed", texto: "text-on-tertiary-fixed-variant" },
  { id: "letras", archivo: "letras.svg", etiqueta: "Letras", descripcion: "Libro abierto sobre fondo lila", icono: "menu_book", fondo: "bg-primary-fixed", texto: "text-on-primary-fixed-variant" },
  { id: "ingenieria", archivo: "ingenieria.svg", etiqueta: "Ingeniería", descripcion: "Persona con casco sobre fondo gris", icono: "engineering", fondo: "bg-surface-container-highest", texto: "text-on-surface-variant" },
];

export const AVATAR_INICIAL = AVATARES[0].id;

/** La API exige una URL http(s) completa para la foto. */
export function urlAvatar(id: string): string {
  const avatar = AVATARES.find((a) => a.id === id) ?? AVATARES[0];
  return `${window.location.origin}/avatars/${avatar.archivo}`;
}

/**
 * Devuelve el avatar temático que corresponde a una foto, o null si es otra imagen
 * (la de Google o uno de los avatares de versiones anteriores, que siguen visibles en /public/avatars).
 */
export function avatarDeFoto(url: string | null | undefined): Avatar | null {
  const id = url?.match(/\/avatars\/([a-z-]+)\.svg(?:$|\?)/)?.[1];
  return AVATARES.find((a) => a.id === id) ?? null;
}
