import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/config";

export const iniciarConCorreo = (correo: string, contrasena: string) =>
  signInWithEmailAndPassword(auth, correo.trim(), contrasena);

export function iniciarConGoogle() {
  const proveedor = new GoogleAuthProvider();
  proveedor.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, proveedor);
}

export async function crearCuentaConCorreo(
  correo: string,
  contrasena: string,
  datos: { displayName: string; photoURL: string },
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
  // El nombre y la foto también quedan en la cuenta de Firebase; si falla no bloquea el registro.
  await updateProfile(user, datos).catch(() => undefined);
  return user;
}

export const cerrarSesion = () => signOut(auth);
