import type { EstadoSalas } from "../hooks/useMisSalas";
import type { Sala } from "../lib/salas";

/** Máximo de salas que una persona puede tener a la vez. */
export const MAX_SALAS = 5;

export type PanelProps = {
  primerNombre: string;
  estado: EstadoSalas;
  salas: Sala[];
  limiteAlcanzado: boolean;
  onCrear: () => void;
  onUnirse: () => void;

  onRenombrar: (sala: Sala) => void;
  onEliminar: (sala: Sala) => void;
  onReintentar: () => void;
};
