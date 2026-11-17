/** Línea con una palabra en medio (p. ej. «o») para separar métodos de acceso. */
export default function Separador({ texto }: { texto: string }) {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label={texto}>
      <span className="h-px flex-1 bg-outline-variant" />
      <span aria-hidden="true" className="font-label text-sm text-on-surface-variant">
        {texto}
      </span>
      <span className="h-px flex-1 bg-outline-variant" />
    </div>
  );
}
