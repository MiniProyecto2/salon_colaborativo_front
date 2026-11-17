export type ItemNav = { to: string; texto: string; textoCorto: string; icono: string };

/** Menú lateral (escritorio). */
export const NAV_LATERAL: ItemNav[] = [
  { to: "/dashboard", texto: "Panel de Salas", textoCorto: "Panel", icono: "meeting_room" },
  { to: "/mis-salas", texto: "Mis Salas Propias", textoCorto: "Mis Salas", icono: "chair" },
  { to: "/pizarra", texto: "Pizarra compartida", textoCorto: "Pizarra", icono: "draw" },
  { to: "/recursos", texto: "Recursos", textoCorto: "Recursos", icono: "library_books" },
  { to: "/ayuda", texto: "Ayuda", textoCorto: "Ayuda", icono: "help_outline" },
];

/** Barra inferior (móvil). */
export const NAV_INFERIOR: ItemNav[] = [
  { to: "/dashboard", texto: "Panel", textoCorto: "Panel", icono: "dashboard" },
  { to: "/mis-salas", texto: "Mis Salas", textoCorto: "Mis Salas", icono: "meeting_room" },
  { to: "/pizarra", texto: "Pizarra", textoCorto: "Pizarra", icono: "draw" },
  { to: "/perfil", texto: "Perfil", textoCorto: "Perfil", icono: "person" },
];
