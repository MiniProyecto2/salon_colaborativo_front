type Props = { pequeno?: boolean; sobreOscuro?: boolean };

/** Indicador de carga decorativo: el texto que lo acompaña es el que se anuncia. */
export default function Spinner({ pequeno = false, sobreOscuro = false }: Props) {
  const tamano = pequeno ? "h-5 w-5 border-2" : "h-8 w-8 border-4";
  const colores = sobreOscuro ? "border-on-primary/40 border-t-on-primary" : "border-primary-fixed-dim border-t-primary";
  return <span aria-hidden="true" className={`${tamano} ${colores} shrink-0 animate-spin rounded-full`} />;
}
