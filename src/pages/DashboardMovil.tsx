import { URL_TIEMPO_REAL } from "../lib/salas";
import FormularioUnirse from "../components/salas/FormularioUnirse";
import Icon from "../components/Icon";
import EstadoVacio from "../components/ui/EstadoVacio";
import { SalasCargandoMovil } from "../components/salas/SalasCargando";
import TarjetaSalaMovil from "../components/salas/TarjetaSalaMovil";
import { MAX_SALAS, type PanelProps } from "./panelTipos";

export default function DashboardMovil({ estado, salas, limiteAlcanzado, onCrear, onRenombrar, onEliminar, onReintentar }: PanelProps) {
  return (
    <div className="w-full px-gutter-mobile py-space-md flex flex-col gap-space-md">
      {URL_TIEMPO_REAL && <FormularioUnirse />}

      {estado === "cargando" && <SalasCargandoMovil />}

      {estado === "error" && (
        <EstadoVacio
          icono="wifi_off"
          tono="error"
          titulo="Sin conexión con el servidor"
          acciones={
            <button
              type="button"
              onClick={onReintentar}
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-label text-label-lg flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
            >
              <Icon name="refresh" className="text-[20px]" />
              Reintentar conexión
            </button>
          }
        >
          No pudimos sincronizar tus salas. Verifica tu red wifi o tus datos móviles.
        </EstadoVacio>
      )}

      {estado === "listo" && salas.length === 0 && (
        <EstadoVacio
          icono="door_open"
          titulo="No tienes salas activas"
          acciones={
            <button
              type="button"
              onClick={onCrear}
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-label text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
            >
              <Icon name="add_circle" className="text-[24px]" />
              Crear mi primera sala
            </button>
          }
          pie={
            <p className="px-3 py-1 bg-surface-container rounded-full flex items-center gap-1.5 text-on-surface-variant font-label text-label-sm">
              <Icon name="lightbulb" className="text-[16px] text-tertiary" />
              Tip: puedes crear salas privadas o públicas
            </p>
          }
        >
          Tu espacio de concentración está despejado. Crea una sala para estudiar en soledad o invita a tus compañeros de carrera.
        </EstadoVacio>
      )}

      {estado === "listo" && salas.length > 0 && (
        <section aria-labelledby="titulo-mis-salas" className="w-full flex flex-col gap-space-md">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 id="titulo-mis-salas" className="font-headline text-headline-sm text-on-surface font-semibold">Mis salas activas</h1>
              <p className="font-body text-body-sm text-on-surface-variant">Sesiones de estudio colaborativo</p>
            </div>
            <button
              type="button"
              onClick={onCrear}
              aria-disabled={limiteAlcanzado || undefined}
              title={limiteAlcanzado ? `Alcanzaste el máximo de ${MAX_SALAS} salas` : undefined}
              className="h-11 px-space-md bg-primary text-on-primary rounded-lg font-label text-label-md flex items-center gap-1 shadow-sm active:scale-95 transition-transform aria-disabled:opacity-60 aria-disabled:pointer-events-none"
            >
              <Icon name="add" className="text-[20px]" />
              Crear
            </button>
          </div>
          <ul className="flex flex-col gap-space-md">
            {salas.map((sala, i) => (
              <li key={sala.id}>
                <TarjetaSalaMovil sala={sala} indice={i} onRenombrar={onRenombrar} onEliminar={onEliminar} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
