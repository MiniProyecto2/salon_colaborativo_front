import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import { clasesBoton, type VarianteBoton } from "./estilos";

type Props = { to: string; variante?: VarianteBoton; icono?: string; anchoCompleto?: boolean; children: ReactNode };

/** Enlace con aspecto de botón (navega a otra pantalla). */
export default function LinkButton({ to, variante = "primary", icono, anchoCompleto = false, children }: Props) {
  return (
    <Link to={to} className={clasesBoton(variante, anchoCompleto)}>
      {icono && <Icon name={icono} className="text-[20px]" />}
      {children}
    </Link>
  );
}
