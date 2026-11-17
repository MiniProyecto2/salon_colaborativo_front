import { ApiError, apiFetch } from "./api";

/** Perfil que devuelve la API (GET/POST /users/me). */
export type Perfil = {
  uid: string;
  email: string | null;
  username: string;
  displayName: string;
  photoURL: string | null;
  bio: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
};

export type NuevoPerfil = { username: string; displayName: string; photoURL?: string };

/** Devuelve el perfil del usuario con sesión, o null si aún no lo ha creado (404). */
export async function obtenerMiPerfil(): Promise<Perfil | null> {
  try {
    return await apiFetch<Perfil>("/users/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export const crearMiPerfil = (datos: NuevoPerfil) =>
  apiFetch<Perfil>("/users/me", { method: "POST", body: datos });

export type CambiosPerfil = Partial<Pick<Perfil, "username" | "displayName" | "photoURL" | "bio">>;

/** Actualiza solo los campos enviados (PATCH /users/me). */
export const actualizarMiPerfil = (cambios: CambiosPerfil) =>
  apiFetch<Perfil>("/users/me", { method: "PATCH", body: cambios });

/** Elimina el perfil y la cuenta de la persona con sesión (DELETE /users/me). */
export const eliminarMiCuenta = () => apiFetch<void>("/users/me", { method: "DELETE" });
