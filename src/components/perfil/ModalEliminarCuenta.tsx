import { useId, useState } from "react";
import { useSesion } from "../../hooks/useSesion";
import { mensajeApi } from "../../lib/errores";
import { eliminarMiCuenta, type Perfil } from "../../lib/perfiles";
import Icon from "../Icon";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

const PALABRA = "ELIMINAR";

type Props = { abierto: boolean; perfil: Perfil; onCerrar: () => void };

function Contenido({ perfil, onCerrar, tituloId, descId }: Omit<Props, "abierto"> & { tituloId: string; descId: string }) {
  const { salir } = useSesion();
  const [texto, setTexto] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const campoId = useId();
  const confirmado = texto.trim().toUpperCase() === PALABRA;

  async function eliminar() {
    if (!confirmado || eliminando) return;
    setError(null);
    setEliminando(true);
    try {
      await eliminarMiCuenta();
      await salir("/"); // cierra la sesión y vuelve a Bienvenida
    } catch (fallo) {
      setError(mensajeApi(fallo));
      setEliminando(false);
    }
  }

  return (
    <div className="p-space-lg flex flex-col gap-space-md">
      <div className="flex items-start gap-space-sm">
        <span aria-hidden="true" className="w-12 h-12 shrink-0 rounded-xl bg-error-container text-error flex items-center justify-center">
          <Icon name="warning" className="text-[28px]" />
        </span>
        <div>
          <span className="font-label text-label-sm text-error font-semibold uppercase tracking-wider">Advertencia crítica e irreversible</span>
          <h2 id={tituloId} className="font-headline text-headline-sm text-on-surface font-bold">
            ¿Eliminar tu cuenta definitivamente?
          </h2>
        </div>
      </div>

      <div id={descId} className="flex flex-col gap-2 font-body text-body-sm text-on-surface-variant">
        <p>
          Esta acción <strong className="text-on-surface">borrará tus datos personales</strong>, eliminará tu acceso y liberará tu nombre de usuario{" "}
          <span className="font-semibold text-primary">@{perfil.username}</span>.
        </p>
        <p>Tus salas activas se cerrarán de inmediato para todos los participantes. No se puede deshacer.</p>
      </div>

      {error && (
        <Alert tipo="error" titulo="No pudimos eliminar tu cuenta">
          {error}
        </Alert>
      )}

      <div className="flex flex-col gap-1.5 rounded-lg bg-surface-container-low p-space-md">
        <label htmlFor={campoId} className="font-label text-label-lg text-on-surface">
          Para confirmar, escribe <span className="font-bold text-error">{PALABRA}</span>:
        </label>
        <input
          id={campoId}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder={PALABRA}
          className="w-full min-h-[48px] rounded-lg bg-surface-container-lowest px-4 font-body text-base text-on-surface placeholder:text-outline border border-outline"
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-space-sm pt-space-xs">
        <button
          type="button"
          data-autofocus
          onClick={onCerrar}
          disabled={eliminando}
          className="min-h-[48px] px-space-md rounded-lg bg-surface-container text-on-surface font-label text-label-lg hover:bg-surface-container-high disabled:opacity-60"
        >
          Cancelar
        </button>
        <Button
          variante="danger"
          icono="person_remove"
          cargando={eliminando}
          textoCargando="Eliminando cuenta…"
          disabled={!confirmado}
          onClick={() => void eliminar()}
        >
          Sí, eliminar mi cuenta
        </Button>
      </div>
    </div>
  );
}

export default function ModalEliminarCuenta({ abierto, perfil, onCerrar }: Props) {
  const tituloId = useId();
  const descId = useId();
  return (
    <Modal abierto={abierto} onCerrar={onCerrar} tituloId={tituloId} descripcionId={descId} ancho="lg">
      <Contenido perfil={perfil} onCerrar={onCerrar} tituloId={tituloId} descId={descId} />
    </Modal>
  );
}
