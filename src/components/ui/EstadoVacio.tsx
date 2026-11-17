import type { ReactNode } from "react";
import Icon from "../Icon";

type Props = {
  icono: string;
  titulo: string;
  tono?: "primario" | "error";
  children: ReactNode;
  acciones?: ReactNode;
  pie?: ReactNode;
};

/** Tarjeta centrada para estados sin contenido o con error (vacío, sin conexión). */
export default function EstadoVacio({ icono, titulo, tono = "primario", children, acciones, pie }: Props) {
  const error = tono === "error";
  return (
    <section className="flex flex-col items-center text-center gap-4 bg-surface-container-lowest rounded-2xl shadow-sm px-6 py-10 md:py-12">
      <div
        aria-hidden="true"
        className={`w-20 h-20 flex items-center justify-center ${
          error ? "rounded-full bg-error-container text-error" : "rounded-2xl bg-primary-fixed text-primary-container"
        }`}
      >
        <Icon name={icono} className="text-[40px]" />
      </div>
      <h2 className="font-headline text-headline-md font-semibold text-on-surface">{titulo}</h2>
      <p className="font-body text-body-md text-on-surface-variant max-w-md">{children}</p>
      {acciones && <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">{acciones}</div>}
      {pie}
    </section>
  );
}
