import { useRef, useState, type FormEvent } from "react";
import { useAvisos } from "../../hooks/useAvisos";
import { useSesion } from "../../hooks/useSesion";
import { ApiError } from "../../lib/api";
import { AVATARES, avatarDeFoto, urlAvatar } from "../../lib/avatares";
import { mensajeApi } from "../../lib/errores";
import { actualizarMiCorreo, actualizarMiPerfil, type CambiosPerfil, type Perfil } from "../../lib/perfiles";
import { MAX_BIO, nombreCompleto, validarBio, validarNombreYApellidos, validarUsuario } from "../../lib/validaciones";
import Alert from "../ui/Alert";
import AvatarPicker from "../ui/AvatarPicker";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import Icon from "../Icon";

type Props = { perfil: Perfil; onCancelar: () => void; onGuardado: () => void };

/** Edición de nombre, usuario, biografía y avatar. Solo envía lo que cambió. */
export default function FormularioPerfil({ perfil, onCancelar, onGuardado }: Props) {
  const { guardarPerfil, salir } = useSesion();
  const { mostrar } = useAvisos();
  const [nombre, setNombre] = useState(perfil.displayName);
  const [usuario, setUsuario] = useState(perfil.username);
  const [correo, setCorreo] = useState(perfil.email ?? "");
  const [bio, setBio] = useState(perfil.bio ?? "");
  const [avatar, setAvatar] = useState<string | null>(avatarDeFoto(perfil.photoURL)?.id ?? null);
  const [errores, setErrores] = useState<{ nombre?: string; usuario?: string; correo?: string; bio?: string }>({});
  const [aviso, setAviso] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const nombreRef = useRef<HTMLInputElement>(null);
  const usuarioRef = useRef<HTMLInputElement>(null);
  const correoRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const avisoRef = useRef<HTMLDivElement>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (guardando) return;
    setAviso(null);

    const nuevos = {
      nombre: validarNombreYApellidos(nombre) ?? undefined,
      usuario: validarUsuario(usuario) ?? undefined,
      bio: validarBio(bio) ?? undefined,
    };
    setErrores(nuevos);
    if (nuevos.nombre) return nombreRef.current?.focus();
    if (nuevos.usuario) return usuarioRef.current?.focus();
    if (nuevos.bio) return bioRef.current?.focus();

    const cambios: CambiosPerfil = {};
    const nombreLimpio = nombreCompleto(nombre, "");
    if (nombreLimpio !== perfil.displayName) cambios.displayName = nombreLimpio;
    if (usuario.trim() !== perfil.username) cambios.username = usuario.trim();
    if (bio.trim() !== (perfil.bio ?? "")) cambios.bio = bio.trim();
    if (avatar && avatar !== avatarDeFoto(perfil.photoURL)?.id) cambios.photoURL = urlAvatar(avatar);

    setGuardando(true);
    try {
      if (Object.keys(cambios).length > 0) guardarPerfil(await actualizarMiPerfil(cambios));
      if (correo.trim().toLowerCase() !== (perfil.email ?? "").toLowerCase()) {
        await actualizarMiCorreo(correo);
        await salir("/iniciar-sesion");
        mostrar("Correo actualizado. Inicia sesión con tu nuevo correo.", "exito");
        return;
      }
      onGuardado();
    } catch (error) {
      if (error instanceof ApiError && error.tipo === "http") {
        const delUsuario = error.detalles.find((d) => d.field === "username");
        if (delUsuario) {
          setErrores({ usuario: delUsuario.message });
          usuarioRef.current?.focus();
          return;
        }
        const delCorreo = error.detalles.find((d) => d.field === "email");
        if (delCorreo || error.status === 403) {
          setErrores({ correo: delCorreo?.message ?? error.message });
          correoRef.current?.focus();
          return;
        }
      }
      setAviso(mensajeApi(error));
      window.setTimeout(() => avisoRef.current?.focus(), 0);
    } finally {
      setGuardando(false);
    }
  }

  const formatoValido = usuario.trim() !== "" && !validarUsuario(usuario);

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-space-lg">
      <div>
        <h2 className="font-headline text-headline-md text-on-surface font-semibold">Editar información personal</h2>
        <p className="font-body text-body-sm text-on-surface-variant">
          Modifica los datos que ven tus compañeros en las salas de estudio.
        </p>
      </div>

      {aviso && (
        <Alert ref={avisoRef} tipo="error" titulo="No pudimos guardar tus cambios" onCerrar={() => setAviso(null)}>
          {aviso}
        </Alert>
      )}

      <AvatarPicker
        valor={avatar}
        onCambio={setAvatar}
        legend="Avatar académico"
        ayuda={`${AVATARES.length} variantes disponibles. Elige la que verán tus compañeros.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        <TextField
          ref={nombreRef}
          etiqueta="Nombres y apellidos"
          nombre="name"
          autoComplete="name"
          ayuda="Visible en el listado de participantes."
          valor={nombre}
          onCambio={(v) => {
            setNombre(v);
            setErrores((x) => ({ ...x, nombre: undefined }));
          }}
          error={errores.nombre}
        />
        <TextField
          ref={usuarioRef}
          etiqueta="Nombre de usuario"
          nombre="username"
          autoComplete="username"
          prefijo="@"
          maxLength={20}
          ayuda="De 3 a 20 caracteres: letras, números o guion bajo (_)."
          insignia={
            formatoValido && !errores.usuario ? (
              <span className="font-label text-label-sm text-secondary font-semibold flex items-center gap-1">
                <Icon name="check_circle" className="text-[16px]" />
                Formato válido
              </span>
            ) : undefined
          }
          valor={usuario}
          onCambio={(v) => {
            setUsuario(v);
            setErrores((x) => ({ ...x, usuario: undefined }));
          }}
          error={errores.usuario}
        />
        <TextField
          ref={correoRef}
          etiqueta="Correo"
          nombre="email"
          tipo="email"
          autoComplete="email"
          maxLength={254}
          ayuda="Para cambiar el correo, tu sesión debe haberse iniciado hace menos de 10 minutos."
          valor={correo}
          onCambio={(valor) => {
            setCorreo(valor);
            setErrores((x) => ({ ...x, correo: undefined }));
          }}
          error={errores.correo}
        />
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="perfil-bio" className="font-label text-sm font-semibold text-on-surface">
              Biografía corta o líneas de estudio
            </label>
            <span aria-hidden="true" className="font-label text-label-sm text-on-surface-variant">
              {bio.length}/{MAX_BIO}
            </span>
          </div>
          <textarea
            ref={bioRef}
            id="perfil-bio"
            rows={3}
            maxLength={MAX_BIO}
            value={bio}
            aria-invalid={errores.bio ? true : undefined}
            aria-describedby="perfil-bio-ayuda"
            onChange={(e) => {
              setBio(e.target.value);
              setErrores((x) => ({ ...x, bio: undefined }));
            }}
            placeholder="Escribe un breve resumen de tus materias o intereses académicos…"
            className={`w-full rounded-lg bg-surface-container-lowest p-4 font-body text-base text-on-surface placeholder:text-outline resize-y ${
              errores.bio ? "border-2 border-error" : "border border-outline"
            }`}
          />
          <p id="perfil-bio-ayuda" className="font-body text-xs md:text-sm text-on-surface-variant">
            {errores.bio ?? `Opcional. Hasta ${MAX_BIO} caracteres.`}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-space-sm pt-space-sm">
        <Button variante="secondary" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Button>
        <Button type="submit" icono="save" cargando={guardando} textoCargando="Guardando…">
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
