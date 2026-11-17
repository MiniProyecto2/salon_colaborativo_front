type IconProps = {
  name: string;
  className?: string;
};

/** Ícono decorativo de Material Symbols. Siempre oculto para lectores de pantalla:
 *  el significado debe estar en el texto o en el aria-label del control que lo contiene. */
export default function Icon({ name, className = "" }: IconProps) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
}
