import { useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { unirseSala, type Sala, mensajeSalas } from "../../lib/salas";
import Icon from "../Icon";
import Alert from "../ui/Alert";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import TextField from "../ui/TextField";

type Fase = "formulario" | "cargando" | "error" | "exito";
type Props = { abierto: boolean; onCerrar: () => void; onUnida: (id: string) => void };

function Contenido({onCerrar, onUnida, tituloId}: Omit<Props, "abierto"> & { tituloId: string }) {
    const [fase, setFase] = useState<Fase>("formulario");
    const [idSala, setIdSala] = useState("");
    const [errorId, setErrorId] = useState<string | null>(null);
    const [errorEnvio, setErrorEnvio] = useState("");
    const [unida, setUnida] = useState<Sala | null>(null);
    const idRef = useRef<HTMLInputElement>(null);

    async function enviar(e: FormEvent) {
        e.preventDefault();
        const limpio = idSala.trim();
        if (!limpio) {
            setErrorId("Ingresa un ID de sala");
            idRef.current?.focus();
            return;
        }
        
        setErrorId(null);
        setFase("cargando");
        try {
            const sala = await unirseSala(limpio);
            setUnida(sala);
            setFase("exito");
            onUnida(sala.id);
            } catch (err) {
                setErrorEnvio(mensajeSalas(err));
                setFase("error");
            }
    }

  const cabecera = (
    <div className="bg-surface-container px-space-lg py-space-md flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
          <Icon name="add_business" className="text-[20px]" />
        </span>
        <h2 id={tituloId} className="font-headline text-headline-sm font-semibold text-on-surface">
          Unirse a sala de estudio
        </h2>
      </div>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        disabled={fase === "cargando"}
        className="w-11 h-11 -mr-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest flex items-center justify-center disabled:opacity-50"
      >
        <Icon name="close" className="text-[22px]" />
      </button>
    </div>
  );

  if (fase === "cargando") {
    return (
      <>
        {cabecera}
        <div role="status" className="p-space-xl flex flex-col items-center text-center gap-space-md">
          <Spinner />
          <div className="flex flex-col gap-1">
            <p className="font-headline text-headline-sm font-semibold text-on-surface">Buscando la sala…</p>
            <p className="font-body text-body-sm text-on-surface-variant">Verificando que el ID único exista.</p>
          </div>
        </div>
      </>
    );
  }

  if (fase === "error") {
    return (
      <>
        {cabecera}
        <div className="p-space-lg flex flex-col gap-space-md">
          <Alert tipo="error" titulo="No pudimos unirte a la sala">
            {errorEnvio}
          </Alert>
          <div className="flex justify-end">
            <button
              type="button"
              data-autofocus
              onClick={() => setFase("formulario")}
              className="min-h-[48px] px-space-lg rounded-lg bg-primary-container text-on-primary font-label text-label-lg shadow-sm hover:bg-primary"
            >
              Modificar datos
            </button>
          </div>
        </div>
      </>
    );
  }

  if (fase === "exito" && unida) {
    return (
      <>
        {cabecera}
        <div role="status" className="p-space-xl flex flex-col items-center text-center gap-space-md">
          <span aria-hidden="true" className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <Icon name="check_circle" className="text-[36px]" />
          </span>
            <div className="flex flex-col gap-1 items-center">
                <p className="font-headline text-headline-sm font-semibold text-on-surface">¡Te uniste con éxito!</p>
                <p className="font-body text-body-sm text-on-surface-variant">Te uniste a <strong className="font-bold">{unida.nombre}</strong></p>
            </div>
          <div className="flex flex-col-reverse sm:flex-row items-stretch gap-space-sm w-full mt-space-sm">
            <button
              type="button"
              onClick={onCerrar}
              className="min-h-[48px] sm:w-1/2 px-space-md rounded-lg bg-surface-container text-on-surface font-label text-label-lg hover:bg-surface-container-high"
            >
              Cancelar
            </button>
            <Link
              to={`/salas/${unida.id}`}
              data-autofocus
              className="min-h-[48px] sm:w-1/2 px-space-md rounded-lg bg-primary-container text-on-primary font-label text-label-lg shadow-sm hover:bg-primary flex items-center justify-center gap-2"
            >
              Entrar a la sala
              <Icon name="arrow_forward" className="text-[20px]" />
            </Link>
          </div>
        </div>
      </>
    );
  }

    return (
        <>
            {cabecera}
            <form noValidate onSubmit={enviar} className="p-space-lg flex flex-col gap-space-md">
                <TextField
                    ref={idRef}
                    etiqueta="ID de la sala"
                    nombre="room-id"
                    valor={idSala}
                    onCambio={(v) => {
                        setIdSala(v)
                        setErrorId(null)
                    }}
                    error={errorId}
                />

                <div className="flex items-center justify-end gap-space-sm pt-space-sm">
                    <button
                        type="button"
                        onClick={onCerrar}
                        className="min-h-[48px] px-space-md rounded-lg bg-surface-container text-on-surface font-label text-label-lg hover:bg-surface-container-high"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="min-h-[48px] flex-1 sm:flex-none px-space-lg rounded-lg bg-primary-container text-on-primary font-label text-label-lg shadow-sm hover:bg-primary flex items-center justify-center gap-2"
                      >
                        <Icon name="rocket_launch" className="text-[20px]" />
                        Unirse a Sala
                      </button>
                    </div>
            </form>        
                    
        </>
    );

}

export default function ModalUnirseSala({ abierto, onCerrar, onUnida }: Props) {
    const tituloId = useId();
    return (
        <Modal abierto={abierto} onCerrar={onCerrar} tituloId={tituloId} ancho="lg">
            <Contenido onCerrar={onCerrar} onUnida={onUnida} tituloId={tituloId} />
        </Modal>
    );
}