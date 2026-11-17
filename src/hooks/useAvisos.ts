import { useContext } from "react";
import { AvisosContext } from "../context/avisos-context";

export function useAvisos() {
  const ctx = useContext(AvisosContext);
  if (!ctx) throw new Error("useAvisos debe usarse dentro de <AvisosProvider>");
  return ctx;
}
