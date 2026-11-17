import { useSyncExternalStore } from "react";

function suscribir(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/** true si el navegador tiene conexión de red. */
export const useEnLinea = () => useSyncExternalStore(suscribir, () => navigator.onLine, () => true);
