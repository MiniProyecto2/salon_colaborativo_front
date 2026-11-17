import Skeleton from "../ui/Skeleton";
import Spinner from "../ui/Spinner";

/** Estado de carga del Panel: el texto se anuncia; las tarjetas grises son decorativas. */
export function SalasCargandoEscritorio() {
  return (
    <div className="flex flex-col gap-space-lg" aria-busy="true">
      <div role="status" className="flex items-center gap-space-sm">
        <Spinner pequeno />
        <span className="font-label text-label-md text-on-surface-variant">Cargando tus salas…</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {[0, 1, 2].map((n) => (
          <div key={n} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-7 w-3/4 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>
            <Skeleton className="h-6 w-32 rounded mt-2" />
            <div className="pt-space-md flex items-center justify-between">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SalasCargandoMovil() {
  return (
    <div className="flex flex-col gap-space-md" aria-busy="true">
      <p role="status" className="sr-only">Cargando tus salas…</p>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
      {[0, 1].map((n) => (
        <div key={n} className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2 w-3/4">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-6 w-48 max-w-full rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <Skeleton className="w-full h-24 rounded-lg" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-11 w-28 rounded-lg" />
            <Skeleton className="h-11 flex-1 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
