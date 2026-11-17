import { useState } from "react";
import { avatarDeFoto } from "../../lib/avatares";
import Icon from "../Icon";

type Props = { foto: string | null | undefined; nombre: string; className?: string; redondo?: boolean };

function iniciales(nombre: string) {
  return nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0] ?? "").join("").toUpperCase() || "?";
}

/** Imagen grande de perfil: ícono temático, foto de la cuenta (Google) o iniciales. Decorativa. */
export default function AvatarPerfil({ foto, nombre, className = "w-24 h-24", redondo = false }: Props) {
  const [fallo, setFallo] = useState<string | null>(null);
  const tematico = avatarDeFoto(foto);
  const forma = redondo ? "rounded-full" : "rounded-2xl";

  if (tematico) {
    return (
      <span aria-hidden="true" className={`${className} ${forma} ${tematico.fondo} ${tematico.texto} flex items-center justify-center shadow-md`}>
        <Icon name={tematico.icono} className="text-[48px]" />
      </span>
    );
  }
  if (foto && fallo !== foto) {
    return (
      <span aria-hidden="true" className={`${className} ${forma} overflow-hidden shadow-md bg-primary block`}>
        <img src={foto} alt="" className="w-full h-full object-cover" onError={() => setFallo(foto)} />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={`${className} ${forma} bg-primary-container text-on-primary font-headline text-3xl font-semibold flex items-center justify-center shadow-md`}>
      {iniciales(nombre)}
    </span>
  );
}
