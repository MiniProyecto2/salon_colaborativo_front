import { useRef } from "react";
import Icon from "../components/Icon";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useApiData } from "../hooks/useApiData";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/** Contrato de GET /api/v1/diagnostico (lee diagnostico/sistema en Firestore). */
type HealthData = {
  message: string; // dato leído de Firestore
  updatedAt?: string; // ISO 8601, opcional
};

export default function DiagnosticoPage() {
  useDocumentTitle("Estado del sistema");
  const { status, data, errorMessage, isSlow, retry } = useApiData<HealthData>("/api/v1/diagnostico");
  const panelRef = useRef<HTMLDivElement>(null);

  // Al reintentar o consultar de nuevo, el botón desaparece: el foco pasa al panel para no perderlo.
  const handleRetry = () => {
    retry();
    panelRef.current?.focus();
  };

  return (
    <div className="max-w-[680px] mx-auto px-margin-mobile md:px-margin py-12 md:py-16">
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-6 md:p-10 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-background tracking-tight">
            Estado del sistema
          </h1>
          <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
            Comprobamos que la aplicación, la API y la base de datos se comunican entre sí.
          </p>
        </header>

        {/* Región viva única y persistente: anuncia los cambios de estado sin mover el foco */}
        <div
          ref={panelRef}
          tabIndex={-1}
          aria-live="polite"
          aria-atomic="true"
          aria-busy={status === "loading"}
          className="outline-none focus-visible:outline-3 focus-visible:outline-primary-container focus-visible:outline-offset-2 rounded-xl"
        >
          {status === "loading" && (
            <div className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4 md:p-6">
              <Spinner />
              <div className="flex flex-col">
                <p className="font-label text-base font-semibold text-on-surface">
                  {isSlow ? "Conectando con el servidor…" : "Cargando…"}
                </p>
                {isSlow && (
                  <p className="font-body text-sm text-on-surface-variant">
                    La primera vez puede tardar unos segundos.
                  </p>
                )}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col gap-4 rounded-xl bg-error-container p-4 md:p-6">
              <div className="flex items-start gap-3">
                <Icon name="error" className="text-[28px] text-on-error-container" />
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline text-lg font-semibold text-on-error-container">
                    No pudimos cargar el estado
                  </h2>
                  <p className="font-body text-sm md:text-base text-on-error-container">{errorMessage}</p>
                </div>
              </div>
              <Button icono="refresh" onClick={handleRetry} className="self-start">
                Reintentar
              </Button>
            </div>
          )}

          {status === "success" && data && (
            <div className="flex flex-col gap-4 rounded-xl bg-secondary-container p-4 md:p-6">
              <div className="flex items-start gap-3">
                <Icon name="check_circle" className="text-[28px] text-on-secondary-container" />
                <h2 className="font-headline text-lg font-semibold text-on-secondary-fixed">Todo funciona</h2>
              </div>
              <dl className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-surface-container-lowest p-4">
                  <dt className="font-label text-sm text-on-surface-variant">Dato leído de Firestore</dt>
                  <dd className="mt-1 font-body text-base font-medium text-on-surface break-words">
                    {data.message}
                  </dd>
                </div>
                {data.updatedAt && (
                  <div className="rounded-lg bg-surface-container-lowest p-4">
                    <dt className="font-label text-sm text-on-surface-variant">Última actualización</dt>
                    <dd className="mt-1 font-body text-base font-medium text-on-surface">
                      <time dateTime={data.updatedAt}>
                        {new Date(data.updatedAt).toLocaleString("es-CO")}
                      </time>
                    </dd>
                  </div>
                )}
              </dl>
              <Button variante="secondary" icono="refresh" onClick={handleRetry} className="self-start">
                Volver a consultar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
