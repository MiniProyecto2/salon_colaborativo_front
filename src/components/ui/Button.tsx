import type { ButtonHTMLAttributes, ReactNode } from "react";
import Icon from "../Icon";
import Spinner from "./Spinner";
import { clasesBoton, type VarianteBoton } from "./estilos";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variante?: VarianteBoton;
  cargando?: boolean;
  /** Texto mientras carga (p. ej. «Creando cuenta…»). */
  textoCargando?: string;
  icono?: string;
  anchoCompleto?: boolean;
  children: ReactNode;
};

export default function Button({
  variante = "primary",
  cargando = false,
  textoCargando,
  icono,
  anchoCompleto = false,
  children,
  type = "button",
  className = "",
  ...resto
}: Props) {
  return (
    <button
      type={type}
      // aria-disabled (y no disabled) mientras carga: el botón conserva el foco y el lector de pantalla no lo pierde.
      aria-disabled={cargando || resto.disabled ? true : undefined}
      aria-busy={cargando || undefined}
      className={`${clasesBoton(variante, anchoCompleto)} ${className}`}
      {...resto}
    >
      {cargando ? <Spinner pequeno sobreOscuro={variante !== "secondary"} /> : icono ? <Icon name={icono} className="text-[20px]" /> : null}
      {cargando && textoCargando ? textoCargando : children}
    </button>
  );
}
