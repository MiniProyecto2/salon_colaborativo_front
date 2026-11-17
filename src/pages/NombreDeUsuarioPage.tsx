import { useEffect, useRef, useState, type FormEvent } from "react";
import GuardiaSesion from "../components/GuardiaSesion";
import Alert from "../components/ui/Alert";
import AuthCard from "../components/ui/AuthCard";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import { useLento } from "../hooks/useLento";
import { useSesion } from "../hooks/useSesion";
import { ApiError } from "../lib/api";
import { mensajeApi } from "../lib/errores";
import { crearMiPerfil } from "../lib/perfiles";
import { MAX_NOMBRE_COMPLETO, sugerirUsuario, validarUsuario } from "../lib/validaciones";

type Aviso = { titulo: string; detalle: string };

function FormularioUsuario() {
  const { usuario, guardarPerfil, recargarPerfil, salir } = useSesion();

  // Normalmente Google ya trae el nombre. Si no lo trae, se pide aquí.
  const nombreDeCuenta = (usuario?.displayName ?? "").trim().slice(0, MAX_NOMBRE_COMPLETO);
  const faltaNombre = nombreDeCuenta.length < 2;

  const [nombre, setNombre] = useState("");
  const [nombreError, setNombreError] = useState<string | null>(null);
  // Es una sugerencia: la persona debe confirmarla (o cambiarla) para continuar.
  const [valor, setValor] = useState(() => sugerirUsuario(usuario?.email));
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [enviando, setEnviando] = useState(false);
  const usuarioRef = useRef<HTMLInputElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const avisoRef = useRef<HTMLDivElement>(null);
  const lento = useLento(enviando);

  useEffect(() => {
    if (aviso) avisoRef.current?.focus();
  }, [aviso]);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    if (enviando) return;
    setAviso(null);

    const errorNombre =
      faltaNombre && (nombre.trim().length < 2 || nombre.trim().length > MAX_NOMBRE_COMPLETO)
        ? `Escribe tu nombre completo (entre 2 y ${MAX_NOMBRE_COMPLETO} caracteres)`
        : null;
    const errorUsuario = validarUsuario(valor);
    setNombreError(errorNombre);
    setError(errorUsuario);
    if (errorNombre) return nombreRef.current?.focus();
    if (errorUsuario) return usuarioRef.current?.focus();

    const foto = usuario?.photoURL;
    setEnviando(true);
    try {
      const perfil = await crearMiPerfil({
        username: valor.trim(),
        displayName: faltaNombre ? nombre.trim().replace(/\s+/g, " ") : nombreDeCuenta,
        ...(foto && foto.length <= 500 && /^https?:\/\//.test(foto) ? { photoURL: foto } : {}),
      });
      guardarPerfil(perfil, { cuentaNueva: true }); // el guardia de sesión lleva al Panel
    } catch (fallo) {
      if (fallo instanceof ApiError && fallo.tipo === "http" && fallo.status === 409) {
        if (fallo.detalles.some((d) => d.field === "username")) {
          setError("Ese nombre de usuario ya está en uso. Prueba con otro.");
          usuarioRef.current?.focus();
        } else {
          recargarPerfil(); // el perfil ya existía: se carga y se entra
        }
      } else {
        setAviso({ titulo: "No pudimos guardar tu nombre de usuario", detalle: `${mensajeApi(fallo)} Pulsa «Continuar» para reintentar.` });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthCard
      titulo="Elige tu nombre de usuario"
      descripcion="Así te verán tus compañeros en las salas. Es el último paso para entrar."
      icono="badge"
    >
      {usuario?.email && (
        <p className="font-body text-sm text-on-surface-variant">
          Sesión iniciada con <span className="font-semibold text-on-surface break-all">{usuario.email}</span>
        </p>
      )}

      {aviso && (
        <Alert ref={avisoRef} tipo="error" titulo={aviso.titulo} onCerrar={() => setAviso(null)}>
          {aviso.detalle}
        </Alert>
      )}

      <form noValidate onSubmit={enviar} className="flex flex-col gap-5">
        {faltaNombre && (
          <TextField
            ref={nombreRef}
            etiqueta="Nombre completo"
            nombre="name"
            autoComplete="name"
            valor={nombre}
            onCambio={(v) => {
              setNombre(v);
              setNombreError(null);
            }}
            error={nombreError}
          />
        )}
        <TextField
          ref={usuarioRef}
          etiqueta="Nombre de usuario"
          nombre="username"
          autoComplete="username"
          prefijo="@"
          maxLength={20}
          ayuda="De 3 a 20 caracteres: letras, números o guion bajo (_). Sin espacios ni tildes."
          valor={valor}
          onCambio={(v) => {
            setValor(v);
            setError(null);
          }}
          error={error}
        />
        <Button type="submit" anchoCompleto cargando={enviando} textoCargando="Guardando…">
          Continuar
        </Button>
        {lento && (
          <p role="status" className="font-body text-sm text-on-surface-variant">
            Conectando con el servidor. La primera vez puede tardar unos segundos.
          </p>
        )}
      </form>

      <Button variante="secondary" icono="logout" anchoCompleto onClick={() => void salir("/registro")}>
        Usar otra cuenta
      </Button>
    </AuthCard>
  );
}

export default function NombreDeUsuarioPage() {
  return (
    <GuardiaSesion modo="nombre-de-usuario">
      <FormularioUsuario />
    </GuardiaSesion>
  );
}
