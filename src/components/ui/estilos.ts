export type VarianteBoton = "primary" | "secondary" | "danger";

const base =
  "min-h-[48px] px-5 inline-flex items-center justify-center gap-2 rounded-lg font-label text-sm font-semibold transition-colors aria-disabled:opacity-70 aria-disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed";

const variantes: Record<VarianteBoton, string> = {
  primary: "bg-primary-container text-on-primary shadow-sm hover:bg-primary",
  secondary: "border border-outline bg-surface-container-lowest text-primary hover:bg-surface-container-low",
  danger: "bg-error text-on-error hover:opacity-90",
};

/** Clases de botón compartidas por <Button> y <LinkButton>: un mismo aspecto en todo el producto. */
export const clasesBoton = (variante: VarianteBoton = "primary", anchoCompleto = false) =>
  `${base} ${variantes[variante]} ${anchoCompleto ? "w-full" : "w-full sm:w-auto"}`;
