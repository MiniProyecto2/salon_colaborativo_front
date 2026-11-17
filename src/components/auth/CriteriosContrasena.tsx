import { criteriosContrasena } from "../../lib/validaciones";
import Icon from "../Icon";

/** Lista de requisitos de la contraseña que se marcan mientras la persona escribe. */
export default function CriteriosContrasena({ valor }: { valor: string }) {
  return (
    <div className="mt-2 rounded-lg bg-surface-container-low p-space-sm">
      <p className="font-label text-label-sm text-on-surface-variant font-semibold mb-1">Requisitos de la contraseña</p>
      <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-x-space-lg gap-y-1">
        {criteriosContrasena(valor).map((c) => (
          <li key={c.texto} className={`flex items-center gap-1.5 font-label text-label-md ${c.cumple ? "text-secondary" : "text-on-surface-variant"}`}>
            <Icon name={c.cumple ? "check_circle" : "radio_button_unchecked"} className="text-[18px]" />
            {c.texto}
            <span className="sr-only">{c.cumple ? " (cumplido)" : " (pendiente)"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
