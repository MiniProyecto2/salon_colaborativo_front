import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { cerrarSesion } from "../lib/autenticacion";
import { registrarSesionInvalida } from "../lib/api";
import { mensajeApi } from "../lib/errores";
import { obtenerMiPerfil, type Perfil } from "../lib/perfiles";
import { SesionContext, type FaseSesion, type Sesion } from "./auth-context";

/** Mantiene la sesión de Firebase y el perfil de la API para toda la aplicación. */
export default function AuthProvider({ children }: { children: ReactNode }) {
  // undefined = Firebase aún no respondió; null = sin sesión
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  const [perfilDe, setPerfilDe] = useState<{ uid: string; perfil: Perfil | null } | null>(null);
  const [errorDe, setErrorDe] = useState<{ uid: string; mensaje: string } | null>(null);
  const [intento, setIntento] = useState(0);
  const [cuentaNueva, setCuentaNueva] = useState(false);
  const [avisoSesion, setAvisoSesion] = useState<string | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Pantalla desde la que se está cerrando la sesión. Se limpia sola cuando la ruta cambia.
  const [saliendoDesde, setSaliendoDesde] = useState<string | null>(null);
  if (saliendoDesde !== null && saliendoDesde !== pathname) setSaliendoDesde(null);
  const saliendo = saliendoDesde !== null;

  useEffect(
    () =>
      onAuthStateChanged(auth, (nuevo) => {
        setUsuario(nuevo);
        if (nuevo) setAvisoSesion(null);
        if (!nuevo) {
          // Al cerrar sesión no queda nada de la persona anterior.
          setPerfilDe(null);
          setErrorDe(null);
          setCuentaNueva(false);
        }
      }),
    [],
  );

  // Si el servidor rechaza el token en cualquier petición, se cierra la sesión y se vuelve al inicio.
  useEffect(() => {
    registrarSesionInvalida(() => {
      setAvisoSesion("No pudimos validar tu sesión. Inicia sesión de nuevo.");
      void cerrarSesion();
      navigate("/", { replace: true });
    });
    return () => registrarSesionInvalida(null);
  }, [navigate]);

  const uid = usuario?.uid;

  useEffect(() => {
    if (!uid) return;
    let cancelado = false;
    obtenerMiPerfil()
      .then((perfil) => {
        if (cancelado) return;
        // Si el registro ya guardó el perfil mientras esta consulta viajaba, no lo pisamos con "sin perfil".
        setPerfilDe((previo) => (previo?.uid === uid && previo.perfil ? previo : { uid, perfil }));
      })
      .catch((error) => {
        if (!cancelado) setErrorDe({ uid, mensaje: mensajeApi(error) });
      });
    return () => {
      cancelado = true;
    };
  }, [uid, intento]);

  const recargarPerfil = useCallback(() => {
    setErrorDe(null);
    setPerfilDe(null);
    setIntento((n) => n + 1);
  }, []);

  const guardarPerfil = useCallback((perfil: Perfil, opciones?: { cuentaNueva?: boolean }) => {
    setErrorDe(null);
    setPerfilDe({ uid: perfil.uid, perfil });
    if (opciones?.cuentaNueva) setCuentaNueva(true);
  }, []);

  const descartarBienvenida = useCallback(() => setCuentaNueva(false), []);
  const descartarAvisoSesion = useCallback(() => setAvisoSesion(null), []);

  // Mientras se cierra la sesión, las pantallas privadas no redirigen a «Iniciar sesión»: se llega a `destino`.
  const salir = useCallback(
    async (destino = "/") => {
      setSaliendoDesde(pathname);
      try {
        await cerrarSesion();
      } finally {
        navigate(destino, { replace: true });
      }
    },
    [navigate, pathname],
  );

  const valor = useMemo<Sesion>(() => {
    const perfilActual = usuario && perfilDe?.uid === usuario.uid ? perfilDe.perfil : undefined;
    const errorActual = usuario && errorDe?.uid === usuario.uid ? errorDe.mensaje : null;

    let fase: FaseSesion;
    if (usuario === undefined) fase = "cargando";
    else if (usuario === null) fase = "sin-sesion";
    else if (perfilActual) fase = "listo";
    else if (perfilActual === null) fase = "sin-perfil";
    else if (errorActual) fase = "error";
    else fase = "verificando";

    return {
      fase,
      haySesion: !!usuario,
      usuario: usuario ?? null,
      perfil: perfilActual ?? null,
      errorPerfil: errorActual,
      cuentaNueva: cuentaNueva && fase === "listo",
      saliendo,
      salir,
      avisoSesion,
      descartarAvisoSesion,
      recargarPerfil,
      guardarPerfil,
      descartarBienvenida,
    };
  }, [usuario, perfilDe, errorDe, cuentaNueva, saliendo, salir, avisoSesion, descartarAvisoSesion, recargarPerfil, guardarPerfil, descartarBienvenida]);

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}
