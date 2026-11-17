/** Cada función devuelve el mensaje de error (qué pasó y cómo corregirlo) o null si el dato es válido. */

const SOLO_LETRAS = /^[\p{L}][\p{L}\s'’.-]*$/u;
const USUARIO = /^[a-zA-Z0-9_]+$/;
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MAX_NOMBRE_COMPLETO = 50;

export function validarNombre(valor: string, plural: "nombres" | "apellidos"): string | null {
  const texto = valor.trim();
  if (!texto) return `Escribe tus ${plural}`;
  if (texto.length < 2) return `Tus ${plural} deben tener al menos 2 letras`;
  if (texto.length > 40) return `Tus ${plural} pueden tener hasta 40 caracteres`;
  if (!SOLO_LETRAS.test(texto)) return `Usa solo letras y espacios en tus ${plural}`;
  return null;
}

export function nombreCompleto(nombres: string, apellidos: string): string {
  return `${nombres} ${apellidos}`.trim().replace(/\s+/g, " ");
}

export function validarNombreCompleto(nombres: string, apellidos: string): string | null {
  return nombreCompleto(nombres, apellidos).length > MAX_NOMBRE_COMPLETO
    ? `Nombres y apellidos juntos pueden tener hasta ${MAX_NOMBRE_COMPLETO} caracteres. Acorta alguno.`
    : null;
}

/** Un solo campo «Nombres y apellidos»: al menos dos palabras, solo letras. */
export function validarNombreYApellidos(valor: string): string | null {
  const texto = nombreCompleto(valor, "");
  if (!texto) return "Escribe tus nombres y apellidos";
  if (texto.length < 3) return "Tu nombre debe tener al menos 3 letras";
  if (!SOLO_LETRAS.test(texto)) return "Usa solo letras y espacios en tu nombre";
  if (texto.split(" ").length < 2) return "Escribe al menos un nombre y un apellido";
  if (texto.length > MAX_NOMBRE_COMPLETO) return `Tu nombre puede tener hasta ${MAX_NOMBRE_COMPLETO} caracteres. Acórtalo.`;
  return null;
}

export const MAX_BIO = 250;
export const validarBio = (valor: string): string | null =>
  valor.length > MAX_BIO ? `La biografía puede tener hasta ${MAX_BIO} caracteres` : null;

/** Criterios de contraseña que se muestran mientras se escribe (coinciden con validarContrasenaNueva). */
export const criteriosContrasena = (valor: string) => [
  { texto: "Mínimo 8 caracteres", cumple: valor.length >= 8 },
  { texto: "Al menos un número", cumple: /\d/.test(valor) },
  { texto: "Al menos una letra", cumple: /\p{L}/u.test(valor) },
];

export function validarUsuario(valor: string): string | null {
  const texto = valor.trim();
  if (!texto) return "Escribe un nombre de usuario";
  if (!USUARIO.test(texto)) return "Usa solo letras, números o guion bajo (_), sin espacios ni tildes";
  if (texto.length < 3 || texto.length > 20) return "El nombre de usuario debe tener entre 3 y 20 caracteres";
  return null;
}

export function validarCorreo(valor: string): string | null {
  const texto = valor.trim();
  if (!texto) return "Escribe tu correo";
  if (!CORREO.test(texto)) return "Escribe un correo válido, por ejemplo nombre@correo.com";
  return null;
}

export function validarContrasenaNueva(valor: string): string | null {
  if (!valor) return "Escribe una contraseña";
  if (valor.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  if (!/\p{L}/u.test(valor) || !/\d/.test(valor)) return "Agrega al menos una letra y un número a tu contraseña";
  return null;
}

export const validarContrasenaActual = (valor: string): string | null => (valor ? null : "Escribe tu contraseña");

/** Sugerencia de nombre de usuario a partir del correo (el estudiante debe confirmarla). */
export function sugerirUsuario(correo: string | null | undefined): string {
  const base = (correo ?? "").split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);
  return base.length >= 3 ? base : "";
}
