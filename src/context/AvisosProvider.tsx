import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import Icon from "../components/Icon";
import { AvisosContext, type TipoAviso } from "./avisos-context";

type Aviso = { id: number; mensaje: string; tipo: TipoAviso };

const ICONOS: Record<TipoAviso, string> = { exito: "check_circle", error: "error", info: "info" };

/** Avisos breves (toast) con región en vivo: los lectores de pantalla anuncian cada mensaje. */
export default function AvisosProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const temporizador = useRef<number | undefined>(undefined);
  const contador = useRef(0);

  const mostrar = useCallback((mensaje: string, tipo: TipoAviso = "exito") => {
    window.clearTimeout(temporizador.current);
    contador.current += 1;
    setAviso({ id: contador.current, mensaje, tipo });
    temporizador.current = window.setTimeout(() => setAviso(null), 4500);
  }, []);

  const valor = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <AvisosContext.Provider value={valor}>
      {children}
      <div
        role={aviso?.tipo === "error" ? "alert" : "status"}
        aria-live={aviso?.tipo === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-4 bottom-24 lg:inset-x-auto lg:bottom-6 lg:right-6 z-[60] flex justify-center lg:justify-end"
      >
        {aviso && (
          <div
            key={aviso.id}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-xl bg-inverse-surface text-inverse-on-surface px-4 py-3 shadow-xl"
          >
            <Icon name={ICONOS[aviso.tipo]} className={`text-[22px] ${aviso.tipo === "error" ? "text-error-container" : "text-secondary-fixed"}`} />
            <span className="font-body text-sm">{aviso.mensaje}</span>
          </div>
        )}
      </div>
    </AvisosContext.Provider>
  );
}
