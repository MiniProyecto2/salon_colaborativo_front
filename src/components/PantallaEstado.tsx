import { useDocumentTitle } from "../hooks/useDocumentTitle";
import Alert from "./ui/Alert";
import Button from "./ui/Button";
import Spinner from "./ui/Spinner";
import { useLento } from "../hooks/useLento";

type Props =
  | { tipo: "cargando"; mensaje: string }
  | { tipo: "error"; titulo: string; mensaje: string; onReintentar: () => void; onSalir: () => void };

/** Pantalla completa para el estado de la sesión: cargando o error con salida clara. */
export default function PantallaEstado(props: Props) {
  useDocumentTitle(props.tipo === "cargando" ? "Cargando" : "No pudimos cargar tu cuenta");
  const lento = useLento(props.tipo === "cargando");

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-margin-mobile md:px-margin">
      <div className="w-full max-w-[520px]">
        {props.tipo === "cargando" ? (
          <div role="status" aria-live="polite" className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm p-6">
            <Spinner />
            <div className="flex flex-col">
              <p className="font-label text-base font-semibold text-on-surface">{props.mensaje}</p>
              {lento && (
                <p className="font-body text-sm text-on-surface-variant">La primera vez puede tardar unos segundos.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm p-6">
            <Alert tipo="error" titulo={props.titulo}>
              {props.mensaje}
            </Alert>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button icono="refresh" onClick={props.onReintentar}>
                Reintentar
              </Button>
              <Button variante="secondary" icono="logout" onClick={props.onSalir}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
