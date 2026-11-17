import { useCallback } from "react";
import { useAvisos } from "./useAvisos";

/** Copia un texto al portapapeles y avisa (con región en vivo) si funcionó. */
export function useCopiar() {
  const { mostrar } = useAvisos();
  return useCallback(
    async (texto: string, etiqueta = "Código") => {
      try {
        await navigator.clipboard.writeText(texto);
        mostrar(`${etiqueta} ${texto} copiado al portapapeles`);
      } catch {
        mostrar("No pudimos copiar. Selecciónalo y cópialo manualmente.", "error");
      }
    },
    [mostrar],
  );
}
