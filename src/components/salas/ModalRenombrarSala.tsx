import { useId, useRef, useState, type FormEvent } from "react";
import { MAX_NOMBRE_SALA, renombrarSala, type Sala, mensajeSalas } from "../../lib/salas";
import { useAvisos } from "../../hooks/useAvisos";
import Icon from "../Icon";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import TextField from "../ui/TextField";

type Props = { sala: Sala | null; onCerrar: () => void; onGuardada: () => void };

function Contenido({ sala, onCerrar, onGuardada, tituloId }: { sala: Sala; onCerrar: () => void; onGuardada: () => void; tituloId: string }) {
  const { mostrar } = useAvisos();
  const [nombre, setNombre] = useState(sala.nombre);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (guardando) return;
    const limpio = nombre.trim().replace(/\s+/g, " ");
    if (!limpio || limpio.length > MAX_NOMBRE_SALA) {
      setError(limpio ? `El nombre puede tener hasta ${MAX_NOMBRE_SALA} caracteres` : "Escribe un nombre para la sala");
      ref.current?.focus();
      return;
    }
    setError(null);
    setAviso(null);
    setGuardando(true);
    try {
      await renombrarSala(sala.id, limpio);
      mostrar("Nombre de la sala actualizado");
      onGuardada();
      onCerrar();
    } catch (fallo) {
      setAviso(mensajeSalas(fallo));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal abierto onCerrar={onCerrar} tituloId={tituloId} bloqueado={guardando}>
      <div className="bg-surface-container px-space-lg py-space-md flex items-center justify-between">
        <h2 id={tituloId} className="font-headline text-headline-sm font-semibold text-on-surface">
          Editar nombre de la sala
        </h2>
        <button
          type="button"
          aria-label="Cerrar"
          disabled={guardando}
          onClick={onCerrar}
          className="w-11 h-11 -mr-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest flex items-center justify-center"
        >
          <Icon name="close" className="text-[22px]" />
        </button>
      </div>
      <form noValidate onSubmit={enviar} className="p-space-lg flex flex-col gap-space-md">
        {aviso && (
          <Alert tipo="error" titulo="No pudimos guardar el cambio">
            {aviso}
          </Alert>
        )}
        <TextField
          ref={ref}
          etiqueta="Nuevo nombre de la sala"
          maxLength={MAX_NOMBRE_SALA}
          valor={nombre}
          onCambio={(v) => {
            setNombre(v);
            setError(null);
          }}
          error={error}
        />
        <div className="flex items-center justify-end gap-space-sm">
          <Button variante="secondary" disabled={guardando} onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" cargando={guardando} textoCargando="Guardando…">
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function ModalRenombrarSala({ sala, onCerrar, onGuardada }: Props) {
  const tituloId = useId();
  return sala ? <Contenido key={sala.id} sala={sala} onCerrar={onCerrar} onGuardada={onGuardada} tituloId={tituloId} /> : null;
}
