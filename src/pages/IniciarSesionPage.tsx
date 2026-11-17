import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import GuardiaSesion from "../components/GuardiaSesion";
import GrupoCampo from "../components/auth/GrupoCampo";
import Alert from "../components/ui/Alert";
import AuthCard from "../components/ui/AuthCard";
import Button from "../components/ui/Button";
import GoogleButton from "../components/ui/GoogleButton";
import Separador from "../components/ui/Separador";
import TextField from "../components/ui/TextField";
import { useAccesoGoogle } from "../hooks/useAccesoGoogle";
import { useLento } from "../hooks/useLento";
import { iniciarConCorreo } from "../lib/autenticacion";
import { MENSAJE_CREDENCIALES, codigoFirebase, mensajeAuth } from "../lib/errores";
import { validarContrasenaActual, validarCorreo } from "../lib/validaciones";

const CODIGOS_CREDENCIALES = [
  "auth/invalid-credential",
  "auth/user-not-found",
  "auth/wrong-password",
  "auth/invalid-email",
  "auth/missing-password",
];

type Aviso = { titulo: string; detalle: string };

function FormularioInicio() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState<{ correo?: string; contrasena?: string }>({});
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [enviando, setEnviando] = useState(false);
  const correoRef = useRef<HTMLInputElement>(null);
  const contrasenaRef = useRef<HTMLInputElement>(null);
  const avisoRef = useRef<HTMLDivElement>(null);

  const google = useAccesoGoogle((detalle) => setAviso({ titulo: "No pudimos entrar con Google", detalle }));
  const lento = useLento(enviando);

  useEffect(() => {
    if (aviso) avisoRef.current?.focus();
  }, [aviso]);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    if (enviando || google.cargando) return;
    setAviso(null);

    const nuevos = {
      correo: validarCorreo(correo) ?? undefined,
      contrasena: validarContrasenaActual(contrasena) ?? undefined,
    };
    setErrores(nuevos);
    if (nuevos.correo) return correoRef.current?.focus();
    if (nuevos.contrasena) return contrasenaRef.current?.focus();

    setEnviando(true);
    try {
      await iniciarConCorreo(correo, contrasena); // el guardia de sesión lleva al Panel
    } catch (error) {
      if (CODIGOS_CREDENCIALES.includes(codigoFirebase(error))) {
        setAviso({ titulo: MENSAJE_CREDENCIALES, detalle: "Revisa tus datos e inténtalo de nuevo." });
      } else {
        const detalle = mensajeAuth(error);
        if (detalle) setAviso({ titulo: "No pudimos iniciar sesión", detalle });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthCard
      pestana="login"
      titulo="Inicia sesión"
      descripcion="Entra con tu correo o con tu cuenta de Google."
      icono="login"
      volverA={{ to: "/", texto: "Volver a Bienvenida" }}
    >
      {aviso && (
        <Alert ref={avisoRef} tipo="error" titulo={aviso.titulo} onCerrar={() => setAviso(null)}>
          {aviso.detalle}
        </Alert>
      )}

      <GrupoCampo>
        <GoogleButton
          texto="Continuar con Google"
          textoCargando="Abriendo Google…"
          cargando={google.cargando}
          onClick={google.acceder}
        />
      </GrupoCampo>

      <Separador texto="o con tu correo" />

      <form noValidate onSubmit={enviar} className="flex flex-col gap-space-md lg:gap-5">
        <GrupoCampo>
        <TextField
          ref={correoRef}
          etiqueta="Correo"
          nombre="email"
          tipo="email"
          autoComplete="email"
          inputMode="email"
          valor={correo}
          onCambio={(v) => {
            setCorreo(v);
            if (errores.correo) setErrores((e) => ({ ...e, correo: undefined }));
          }}
          error={errores.correo}
        />
        </GrupoCampo>
        <GrupoCampo>
        <TextField
          ref={contrasenaRef}
          etiqueta="Contraseña"
          nombre="password"
          tipo="password"
          autoComplete="current-password"
          valor={contrasena}
          onCambio={(v) => {
            setContrasena(v);
            if (errores.contrasena) setErrores((e) => ({ ...e, contrasena: undefined }));
          }}
          error={errores.contrasena}
        />
        </GrupoCampo>
        <Button type="submit" anchoCompleto icono="login" cargando={enviando} textoCargando="Iniciando sesión…">
          Iniciar sesión
        </Button>
        {lento && (
          <p role="status" className="font-body text-sm text-on-surface-variant">
            Conectando con el servidor. La primera vez puede tardar unos segundos.
          </p>
        )}
      </form>


      <p className="font-body text-sm text-on-surface-variant text-center lg:text-left">
        ¿Aún no tienes cuenta?{" "}
        <Link to="/registro" className="font-semibold text-primary underline underline-offset-2">
          Regístrate
        </Link>
      </p>
    </AuthCard>
  );
}

export default function IniciarSesionPage() {
  return (
    <GuardiaSesion modo="invitado">
      <FormularioInicio />
    </GuardiaSesion>
  );
}
