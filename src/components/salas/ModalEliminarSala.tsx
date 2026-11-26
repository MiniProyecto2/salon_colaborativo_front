import { useId, useState } from "react";
import { useAvisos } from "../../hooks/useAvisos";
import { eliminarSala, type Sala, mensajeSalas } from "../../lib/salas";
import Icon from "../Icon";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

type Props = { sala: Sala | null; onCerrar: () => void; onEliminada: () => void };

function Contenido({ sala, onCerrar, onEliminada, tituloId, descId }: { sala: Sala; onCerrar: () => void; onEliminada: () => void; tituloId: string; descId: string }) {
  const { mostrar } = useAvisos();
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmar() {
    if (eliminando) return;
    setError(null);
    setEliminando(true);
    try {
      await eliminarSala(sala.id);
      mostrar(`Sala ${sala.id} eliminada`);
      onEliminada();
      onCerrar();
    } catch (fallo) {
      setError(mensajeSalas(fallo));
      setEliminando(false);
    }
  }

  return (
    <Modal abierto onCerrar={onCerrar} tituloId={tituloId} descripcionId={descId} bloqueado={eliminando}>
      <div className="p-space-lg flex flex-col gap-space-md">
        <span aria-hidden="true" className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center">
          <Icon name="warning" className="text-[28px]" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 id={tituloId} className="font-headline text-headline-sm font-bold text-on-surface">
            ¿Deseas eliminar esta sala de estudio?
          </h2>
          <p id={descId} className="font-body text-body-sm text-on-surface-variant">
            Estás a punto de borrar definitivamente <strong className="text-on-surface">{sala.nombre}</strong> ({sala.id}).
          </p>
        </div>
        {sala.presentes > 0 && (
          <div className="p-space-sm rounded-lg bg-error-container/60 text-on-error-container flex items-start gap-2">
            <Icon name="groups" className="text-[20px] text-error" />
            <p className="font-label text-label-md">
              <strong>Advertencia para participantes:</strong> hay {sala.presentes} {sala.presentes === 1 ? "persona conectada" : "personas conectadas"}.
              Los participantes recibirán un aviso y volverán al panel.
            </p>
          </div>
        )}
        {error && (
          <Alert tipo="error" titulo="No pudimos eliminar la sala">
            {error}
          </Alert>
        )}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:justify-end gap-space-sm pt-space-xs">
          <button
            type="button"
            data-autofocus
            onClick={onCerrar}
            disabled={eliminando}
            className="min-h-[48px] px-space-md rounded-lg bg-surface-container text-on-surface font-label text-label-lg hover:bg-surface-container-high disabled:opacity-60"
          >
            Conservar sala
          </button>
          <Button variante="danger" cargando={eliminando} textoCargando="Eliminando…" onClick={() => void confirmar()}>
            Eliminar sala ahora
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function ModalEliminarSala({ sala, onCerrar, onEliminada }: Props) {
  const tituloId = useId();
  const descId = useId();
  return sala ? <Contenido key={sala.id} sala={sala} onCerrar={onCerrar} onEliminada={onEliminada} tituloId={tituloId} descId={descId} /> : null;
}
