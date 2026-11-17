import { useId } from "react";
import { AVATARES } from "../../lib/avatares";
import Icon from "../Icon";

type Props = {
  /** id del avatar elegido; null si la foto actual no es de la lista. */
  valor: string | null;
  onCambio: (id: string) => void;
  legend?: string;
  ayuda?: string;
};

/** Elige un avatar temático. Son botones de opción nativos: se recorren con las flechas del teclado. */
export default function AvatarPicker({ valor, onCambio, legend = "Avatar de estudio", ayuda = "Elige la imagen que verán tus compañeros. Puedes cambiarla después." }: Props) {
  const nombre = useId();
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-label text-sm font-semibold text-on-surface">{legend}</legend>
      <p className="font-body text-xs md:text-sm text-on-surface-variant">{ayuda}</p>
      <div className="grid grid-cols-5 gap-2 md:gap-3 mt-1">
        {AVATARES.map((avatar) => (
          <label key={avatar.id} className="relative block cursor-pointer">
            <input
              type="radio"
              name={nombre}
              value={avatar.id}
              checked={valor === avatar.id}
              onChange={() => onCambio(avatar.id)}
              className="peer sr-only"
            />
            <span className="flex flex-col items-center gap-1 md:gap-1.5 rounded-xl bg-surface-container-low px-0.5 py-1.5 md:p-2 border-2 border-transparent transition-colors hover:bg-surface-container peer-checked:border-primary-container peer-checked:bg-surface-container-lowest peer-focus-visible:outline-3 peer-focus-visible:outline-primary-container peer-focus-visible:outline-offset-2">
              <span aria-hidden="true" className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${avatar.fondo} ${avatar.texto}`}>
                <Icon name={avatar.icono} className="text-[24px] md:text-[28px]" />
              </span>
              <span aria-hidden="true" className="font-label text-[10px] leading-3 md:text-label-sm md:leading-[14px] font-medium text-on-surface">
                {avatar.etiqueta}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="hidden peer-checked:flex absolute right-1 top-1 w-4 h-4 rounded-full bg-primary-container text-on-primary items-center justify-center"
            >
              <Icon name="check" className="text-[12px]" />
            </span>
            <span className="sr-only">
              {avatar.etiqueta}: {avatar.descripcion}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
