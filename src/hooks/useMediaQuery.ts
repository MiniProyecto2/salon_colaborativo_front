import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [coincide, setCoincide] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const alCambiar = () => setCoincide(mq.matches);
    alCambiar();
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, [query]);

  return coincide;
}
