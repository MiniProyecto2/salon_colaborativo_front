import { useEffect } from "react";

/** Título distinto en cada pantalla (WCAG 2.4.2). */
export function useDocumentTitle(titulo: string) {
  useEffect(() => {
    document.title = `${titulo} · Salón de Estudio`;
  }, [titulo]);
}
