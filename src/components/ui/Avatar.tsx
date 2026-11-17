import { useState } from "react";

const tamanos = { sm: "w-8 h-8 text-xs", md: "w-12 h-12 text-base", lg: "w-16 h-16 text-xl" };

function iniciales(nombre: string) {
  const letras = nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0] ?? "");
  return letras.join("").toUpperCase() || "?";
}

type Props = { src?: string | null; nombre: string; tamano?: keyof typeof tamanos };

/** Foto de perfil; si no hay foto o no carga, muestra las iniciales. Es decorativa: el nombre va en el texto contiguo. */
export default function Avatar({ src, nombre, tamano = "md" }: Props) {
  const [fallo, setFallo] = useState<string | null>(null);
  const mostrarFoto = !!src && fallo !== src;

  return (
    <span
      aria-hidden="true"
      className={`${tamanos[tamano]} shrink-0 rounded-full overflow-hidden bg-primary text-on-primary font-headline font-semibold inline-flex items-center justify-center`}
    >
      {mostrarFoto ? (
        <img src={src} alt="" className="w-full h-full object-cover" onError={() => setFallo(src)} />
      ) : (
        iniciales(nombre)
      )}
    </span>
  );
}
