import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import GuardiaSesion from "../components/GuardiaSesion";
import CriteriosContrasena from "../components/auth/CriteriosContrasena";
import GrupoCampo from "../components/auth/GrupoCampo";
import Alert from "../components/ui/Alert";
import AuthCard from "../components/ui/AuthCard";
import AvatarPicker from "../components/ui/AvatarPicker";
import Button from "../components/ui/Button";
import GoogleButton from "../components/ui/GoogleButton";
import Separador from "../components/ui/Separador";
import TextField from "../components/ui/TextField";
import { useAccesoGoogle } from "../hooks/useAccesoGoogle";
import { useLento } from "../hooks/useLento";
import { useSesion } from "../hooks/useSesion";
import { ApiError } from "../lib/api";
import { AVATAR_INICIAL, urlAvatar } from "../lib/avatares";
import { crearCuentaConCorreo } from "../lib/autenticacion";
import { codigoFirebase, mensajeApi, mensajeAuth } from "../lib/errores";
import { crearMiPerfil } from "../lib/perfiles";
import { nombreCompleto, validarContrasenaNueva, validarCorreo, validarNombreYApellidos, validarUsuario } from "../lib/validaciones";

type Campo = "nombre" | "usuario" | "correo" | "contrasena";
type Valores = Record<Campo, string>;
type Errores = Partial<Record<Campo, string>>;
type Aviso = { titulo: string; detalle: string };

const ORDEN: Campo[] = ["nombre", "usuario", "correo", "contrasena"];
const VACIOS: Valores = { nombre: "", usuario: "", correo: "", contrasena: "" };

function validar(v: Valores): Errores {
  return {
    nombre: validarNombreYApellidos(v.nombre) ?? undefined,
    usuario: validarUsuario(v.usuario) ?? undefined,
    correo: validarCorreo(v.correo) ?? undefined,
    contrasena: validarContrasenaNueva(v.contrasena) ?? undefined,
  };
}

function FormularioRegistro({ onIniciarManual }: { onIniciarManual: () => void }) {
  const { usuario, guardarPerfil, recargarPerfil } = useSesion();
  const [valores, setValores] = useState<Valores>(VACIOS);
  const [avatar, setAvatar] = useState(AVATAR_INICIAL);
  const [errores, setErrores] = useState<Errores>({});
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [enviando, setEnviando] = useState(false);
  const nombreRef = useRef<HTMLInputElement>(null);
  const usuarioRef = useRef<HTMLInputElement>(null);
  const correoRef = useRef<HTMLInputElement>(null);
  const contrasenaRef = useRef<HTMLInputElement>(null);
  const avisoRef = useRef<HTMLDivElement>(null);
  const lento = useLento(enviando);
  const google = useAccesoGoogle((detalle) => setAviso({ titulo: "No pudimos registrarte con Google", detalle }));

  useEffect(() => {
    if (aviso) avisoRef.current?.focus();
  }, [aviso]);

  const cambiar = (campo: Campo) => (valor: string) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  function marcarError(nuevos: Errores) {
    setErrores(nuevos);
    const primero = ORDEN.find((campo) => nuevos[campo]);
    const campos = { nombre: nombreRef, usuario: usuarioRef, correo: correoRef, contrasena: contrasenaRef };
    if (primero) campos[primero].current?.focus();
  }

  /** Errores de la API al crear el perfil (la cuenta de acceso ya existe en este punto). */
  function manejarErrorDePerfil(error: unknown) {
    if (error instanceof ApiError && error.tipo === "http") {
      const usuarioOcupado = error.status === 409 && error.detalles.some((d) => d.field === "username");
      if (usuarioOcupado) return marcarError({ usuario: "Ese nombre de usuario ya está en uso. Prueba con otro." });
      if (error.status === 409) return recargarPerfil(); // el perfil ya existía: se carga y se entra
      const delUsuario = error.detalles.find((d) => d.field === "username");
      if (error.status === 400 && delUsuario) return marcarError({ usuario: delUsuario.message });
    }
    setAviso({
      titulo: "Tu cuenta se creó, pero no pudimos terminar el registro",
      detalle: `${mensajeApi(error)} Pulsa «Crear mi cuenta» otra vez para reintentar: no perderás lo que escribiste.`,
    });
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    if (enviando || google.cargando) return;
    setAviso(null);

    const nuevos = validar(valores);
    if (ORDEN.some((campo) => nuevos[campo])) return marcarError(nuevos);
    setErrores({});

    const displayName = nombreCompleto(valores.nombre, "");
    const photoURL = urlAvatar(avatar);

    onIniciarManual(); // evita que el guardia de sesión desmonte el formulario mientras se crea la cuenta
    setEnviando(true);
    try {
      // Si un intento anterior ya creó la cuenta pero falló el perfil, no se vuelve a crear.
      const cuentaYaCreada = usuario?.email?.toLowerCase() === valores.correo.trim().toLowerCase();
      if (!cuentaYaCreada) {
        try {
          await crearCuentaConCorreo(valores.correo, valores.contrasena, { displayName, photoURL });
        } catch (error) {
          switch (codigoFirebase(error)) {
            case "auth/email-already-in-use":
              return marcarError({ correo: "Este correo ya está registrado. Inicia sesión o usa otro correo." });
            case "auth/invalid-email":
              return marcarError({ correo: "Escribe un correo válido, por ejemplo nombre@correo.com" });
            case "auth/weak-password":
              return marcarError({ contrasena: "Esta contraseña es muy débil. Usa 8 caracteres o más, con letras y números." });
            default: {
              const detalle = mensajeAuth(error);
              if (detalle) setAviso({ titulo: "No pudimos crear tu cuenta", detalle });
              return;
            }
          }
        }
      }

      try {
        const perfil = await crearMiPerfil({ username: valores.usuario.trim(), displayName, photoURL });
        guardarPerfil(perfil, { cuentaNueva: true }); // el guardia de sesión lleva al Panel
      } catch (error) {
        manejarErrorDePerfil(error);
      }
    } finally {
      setEnviando(false);
    }
  }

  const formatoValido = valores.usuario.trim() !== "" && !validarUsuario(valores.usuario);

  return (
    <AuthCard
      pestana="registro"
      titulo="Crea tu cuenta de estudio"
      descripcion="Únete a salas académicas colaborativas y sincroniza tus sesiones en tiempo real."
      icono="how_to_reg"
      volverA={{ to: "/", texto: "Volver a Bienvenida" }}
    >
      {aviso && (
        <Alert ref={avisoRef} tipo="error" titulo={aviso.titulo} onCerrar={() => setAviso(null)}>
          {aviso.detalle}
        </Alert>
      )}

      <GrupoCampo>
        <div className="flex flex-col gap-2">
          <GoogleButton
            texto="Continuar con Google"
            textoCargando="Abriendo Google…"
            cargando={google.cargando}
            onClick={google.acceder}
          />
          <p className="flex items-start gap-1.5 font-body text-xs md:text-sm text-on-surface-variant">
            <Icon name="info" className="text-[16px] mt-0.5 shrink-0" />
            Si es tu primer ingreso con Google, en el siguiente paso elegirás tu nombre de usuario.
          </p>
        </div>
      </GrupoCampo>

      <Separador texto="o con tu correo" />

      <form noValidate onSubmit={enviar} className="flex flex-col gap-space-md lg:gap-5">
        <GrupoCampo>
          <TextField
            ref={nombreRef}
            etiqueta="Nombres y apellidos"
            nombre="name"
            autoComplete="name"
            ayuda="Tal como quieres que te vean tus compañeros."
            valor={valores.nombre}
            onCambio={cambiar("nombre")}
            error={errores.nombre}
          />
        </GrupoCampo>

        <GrupoCampo>
          <TextField
            ref={usuarioRef}
            etiqueta="Nombre de usuario"
            nombre="username"
            autoComplete="username"
            prefijo="@"
            maxLength={20}
            ayuda="De 3 a 20 caracteres: letras, números o guion bajo (_). Sin espacios ni tildes."
            insignia={
              formatoValido && !errores.usuario ? (
                <span className="font-label text-label-sm text-secondary font-semibold flex items-center gap-1">
                  <Icon name="check_circle" className="text-[16px]" />
                  Formato válido
                </span>
              ) : undefined
            }
            valor={valores.usuario}
            onCambio={cambiar("usuario")}
            error={errores.usuario}
          />
        </GrupoCampo>

        <GrupoCampo>
          <TextField
            ref={correoRef}
            etiqueta="Correo electrónico"
            nombre="email"
            tipo="email"
            autoComplete="email"
            inputMode="email"
            ayuda="Puedes usar tu correo institucional o personal."
            valor={valores.correo}
            onCambio={cambiar("correo")}
            error={errores.correo}
          />
        </GrupoCampo>

        <GrupoCampo>
          <AvatarPicker valor={avatar} onCambio={setAvatar} legend="Elige tu avatar de estudio" />
        </GrupoCampo>

        <GrupoCampo>
          <TextField
            ref={contrasenaRef}
            etiqueta="Contraseña segura"
            nombre="new-password"
            tipo="password"
            autoComplete="new-password"
            valor={valores.contrasena}
            onCambio={cambiar("contrasena")}
            error={errores.contrasena}
          />
          <CriteriosContrasena valor={valores.contrasena} />
        </GrupoCampo>

        <Button type="submit" anchoCompleto icono="how_to_reg" cargando={enviando} textoCargando="Creando cuenta…">
          Crear mi cuenta
        </Button>
        {lento && (
          <p role="status" className="font-body text-sm text-on-surface-variant">
            Conectando con el servidor. La primera vez puede tardar unos segundos.
          </p>
        )}
      </form>

      <p className="font-body text-sm text-on-surface-variant text-center lg:text-left">
        ¿Ya tienes cuenta?{" "}
        <Link to="/iniciar-sesion" className="font-semibold text-primary underline underline-offset-2">
          Inicia sesión aquí
        </Link>
      </p>
    </AuthCard>
  );
}

export default function RegistroPage() {
  // Mientras se crea la cuenta con correo, el guardia no debe desmontar el formulario
  // (la sesión aparece antes de que el perfil esté guardado). Con Google, en cambio, sí
  // debe llevar a «Elige tu nombre de usuario».
  const [manual, setManual] = useState(false);
  return (
    <GuardiaSesion modo={manual ? "registro-manual" : "invitado"}>
      <FormularioRegistro onIniciarManual={() => setManual(true)} />
    </GuardiaSesion>
  );
}
