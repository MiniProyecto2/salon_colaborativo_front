import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSesion } from "../hooks/useSesion";
import PantallaEstado from "./PantallaEstado";

/**
 * invitado          → login y registro: si ya hay sesión, va al Panel
 * registro-manual   → igual, pero no se interrumpe mientras se crea la cuenta y el perfil
 * nombre-de-usuario → solo con sesión y sin perfil (paso obligatorio tras registrarse con Google)
 * privado           → Panel, Mi perfil y Salas: exigen un token válido; sin él, vuelven a la página de inicio
 */
type Modo = "invitado" | "registro-manual" | "nombre-de-usuario" | "privado";

export default function GuardiaSesion({ modo, children }: { modo: Modo; children: ReactNode }) {
  const { fase, errorPerfil, recargarPerfil, saliendo, salir } = useSesion();

  const cargando = (
    <PantallaEstado tipo="cargando" mensaje={fase === "cargando" ? "Comprobando tu sesión…" : "Verificando tu cuenta…"} />
  );
  // Sin sesión (sin token) las pantallas privadas devuelven a la página de inicio.
  const aInicio = <Navigate to="/" replace />;
  const aPanel = <Navigate to="/dashboard" replace />;

  if (saliendo && (modo === "privado" || modo === "nombre-de-usuario")) {
    return <PantallaEstado tipo="cargando" mensaje="Cerrando sesión…" />;
  }

  switch (modo) {
    case "privado":
      if (fase === "cargando" || fase === "verificando") return cargando;
      if (fase === "sin-sesion") return aInicio;
      if (fase === "sin-perfil") return <Navigate to="/registro/nombre-de-usuario" replace />;
      if (fase === "error") {
        return (
          <PantallaEstado
            tipo="error"
            titulo="No pudimos cargar tu cuenta"
            mensaje={errorPerfil ?? "Inténtalo de nuevo."}
            onReintentar={recargarPerfil}
            onSalir={() => void salir()}
          />
        );
      }
      return children;

    case "nombre-de-usuario":
      if (fase === "cargando" || fase === "verificando") return cargando;
      if (fase === "sin-sesion") return aInicio;
      if (fase === "listo" || fase === "error") return aPanel;
      return children;

    case "registro-manual":
      if (fase === "cargando") return cargando;
      if (fase === "listo") return aPanel;
      return children;

    default: // invitado
      if (fase === "cargando" || fase === "verificando") return cargando;
      if (fase === "listo" || fase === "error") return aPanel;
      if (fase === "sin-perfil") return <Navigate to="/registro/nombre-de-usuario" replace />;
      return children;
  }
}
