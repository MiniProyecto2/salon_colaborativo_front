/** Bloque gris pulsante para los estados de carga. Decorativo: el texto de estado va aparte. */
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`bg-surface-container-high animate-pulse ${className}`} />;
}
