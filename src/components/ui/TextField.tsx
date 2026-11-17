import { useId, useState, type HTMLInputTypeAttribute, type ReactNode, type Ref } from "react";
import Icon from "../Icon";

type Props = {
  etiqueta: string;
  valor: string;
  onCambio: (valor: string) => void;
  nombre?: string;
  tipo?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric";
  maxLength?: number;
  /** Texto de ayuda siempre visible bajo el campo (qué se espera escribir). */
  ayuda?: string;
  /** Mensaje de error junto al campo: qué pasó y cómo corregirlo. */
  error?: string | null;
  disabled?: boolean;
  /** Texto fijo antes del valor (p. ej. «@»). */
  prefijo?: string;
  /** Elemento a la derecha de la etiqueta (p. ej. «Formato válido»). */
  insignia?: ReactNode;
  requerido?: boolean;
  ref?: Ref<HTMLInputElement>;
};

/** Campo de formulario con etiqueta, ayuda y error asociados. En contraseñas incluye «Mostrar/Ocultar». */
export default function TextField({
  etiqueta,
  valor,
  onCambio,
  nombre,
  tipo = "text",
  autoComplete,
  inputMode,
  maxLength,
  ayuda,
  error,
  disabled,
  prefijo,
  insignia,
  requerido = true,
  ref,
}: Props) {
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const [visible, setVisible] = useState(false);
  const esContrasena = tipo === "password";
  const describedBy = [ayuda && idAyuda, error && idError].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="font-label text-sm font-semibold text-on-surface">
          {etiqueta}
          {requerido && <span aria-hidden="true" className="text-error"> *</span>}
        </label>
        {insignia}
      </div>
      <div className="relative">
        {prefijo && (
          <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-base text-on-surface-variant">
            {prefijo}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          name={nombre}
          type={esContrasena && visible ? "text" : tipo}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          disabled={disabled}
          aria-required={requerido}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          autoCapitalize={tipo === "email" || nombre === "username" ? "none" : undefined}
          spellCheck={false}
          className={`w-full min-h-[48px] rounded-lg bg-surface-container-lowest disabled:bg-surface-container px-4 font-body text-base text-on-surface placeholder:text-outline disabled:opacity-60 ${
            esContrasena ? "pr-14" : ""
          } ${prefijo ? "pl-9" : ""} ${error ? "border-2 border-error" : "border border-outline"}`}
        />
        {esContrasena && (
          <button
            type="button"
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
          >
            <Icon name={visible ? "visibility_off" : "visibility"} className="text-[22px]" />
          </button>
        )}
      </div>
      {ayuda && (
        <p id={idAyuda} className="font-body text-xs md:text-sm text-on-surface-variant">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="flex items-start gap-1 font-body text-sm text-error">
          <Icon name="error" className="text-[18px] mt-px shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
