import type { ReactNode, Ref } from "react";
import Icon from "../Icon";

type Tipo = "error" | "exito" | "info";

const estilos: Record<Tipo, { caja: string; icono: string }> = {
  error: { caja: "bg-error-container text-on-error-container", icono: "error" },
  exito: { caja: "bg-secondary-container text-on-secondary-fixed", icono: "check_circle" },
  info: { caja: "bg-primary-fixed text-on-primary-fixed", icono: "info" },
};

type Props = {
  tipo: Tipo;
  titulo: string;
  children?: ReactNode;
  onCerrar?: () => void;
  ref?: Ref<HTMLDivElement>;
};

/** Mensaje de la pantalla (error, éxito o información). Los errores se anuncian de inmediato. */
export default function Alert({ tipo, titulo, children, onCerrar, ref }: Props) {
  const { caja, icono } = estilos[tipo];
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={tipo === "error" ? "alert" : "status"}
      className={`${caja} flex items-start gap-3 rounded-xl p-4 outline-none focus-visible:outline-3 focus-visible:outline-primary-container focus-visible:outline-offset-2`}
    >
      <Icon name={icono} className="text-[24px] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-label text-sm md:text-base font-semibold">{titulo}</p>
        {children && <div className="mt-1 font-body text-sm md:text-base">{children}</div>}
      </div>
      {onCerrar && (
        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={onCerrar}
          className="-m-2 min-w-[44px] min-h-[44px] shrink-0 flex items-center justify-center rounded-lg hover:bg-on-surface/10"
        >
          <Icon name="close" className="text-[20px]" />
        </button>
      )}
    </div>
  );
}
