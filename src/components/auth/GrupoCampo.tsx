import type { ReactNode } from "react";

/** En móvil cada campo va en su propia tarjeta (como en el prototipo); en escritorio no añade nada. */
export default function GrupoCampo({ children }: { children: ReactNode }) {
  return <div className="max-lg:bg-surface-container-lowest max-lg:rounded-xl max-lg:p-space-md max-lg:shadow-sm">{children}</div>;
}
