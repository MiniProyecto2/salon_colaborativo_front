import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import Icon from "./Icon";

type Props = {
  titulo: string;
  sprint?: number;
  descripcion?: string;
  volverA?: { to: string; texto: string };
  children?: ReactNode;
};

/** Marcador de las pantallas del mapa del sitio que se construyen en sprints posteriores. */
export default function PantallaEnConstruccion({ titulo, sprint, descripcion, volverA, children }: Props) {
  useDocumentTitle(titulo);

  return (
    <div className="max-w-[680px] mx-auto px-margin-mobile md:px-margin py-12 md:py-16">
      {volverA && (
        <Link to={volverA.to} className="inline-flex items-center gap-1 min-h-[44px] mb-4 text-primary font-label text-sm rounded-lg hover:underline">
          <Icon name="arrow_back" className="text-[20px]" />
          {volverA.texto}
        </Link>
      )}

      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-6 md:p-10 flex flex-col gap-4">
        <div aria-hidden="true" className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
          <Icon name="construction" className="text-[28px]" />
        </div>
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-background tracking-tight">{titulo}</h1>
        <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
          {descripcion ?? "Esta pantalla se implementa en un sprint posterior."}
          {sprint ? ` Se entrega en el Sprint ${sprint}.` : ""}
        </p>
        {children}
      </div>
    </div>
  );
}
