import { Link } from "react-router-dom";
import { useCopiar } from "../../hooks/useCopiar";
import type { Sala } from "../../lib/salas";
import Icon from "../Icon";
import MenuAcciones from "./MenuAcciones";
import { tonoIniciales } from "./colores";

type Props = { sala: Sala; onRenombrar: (s: Sala) => void; onEliminar: (s: Sala) => void };

/** Tarjeta de sala para escritorio. */
export default function TarjetaSala({ sala, onRenombrar, onEliminar }: Props) {
  const copiar = useCopiar();
  const enVivo = sala.estado === "en-vivo";
  const extra = sala.presentes - sala.iniciales.length;

  return (
    <article className="group w-full bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
      <div className="p-space-lg flex flex-col gap-space-md">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full font-label text-label-sm ${
              enVivo ? "bg-secondary-fixed text-on-secondary-fixed font-semibold" : "bg-surface-container text-on-surface-variant font-medium"
            }`}
          >
            <span aria-hidden="true" className={`w-2 h-2 rounded-full ${enVivo ? "bg-secondary animate-pulse" : "bg-outline"}`} />
            {enVivo ? "En vivo" : "En pausa"} ({sala.presentes} {sala.presentes === 1 ? "presente" : "presentes"})
          </span>
          <MenuAcciones
            etiqueta={`Opciones de la sala ${sala.nombre}`}
            acciones={[
              { texto: "Editar nombre", icono: "edit", onClick: () => onRenombrar(sala) },
              { texto: "Eliminar sala", icono: "delete", peligro: true, onClick: () => onEliminar(sala) },
            ]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-label text-label-sm text-on-surface-variant font-medium tracking-wide">
            ID: <code className="font-semibold text-primary">{sala.id}</code>
          </span>
          <h3 className="font-headline text-headline-sm text-on-surface font-semibold group-hover:text-primary-container transition-colors">
            {sala.nombre}
          </h3>
          <p className="font-body text-body-sm text-on-surface-variant line-clamp-2">{sala.descripcion}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="px-2 py-0.5 rounded font-label text-label-sm bg-surface-container text-on-surface-variant">{sala.materia}</span>
          <span className="font-label text-label-sm text-on-surface-variant flex items-center gap-1">
            <Icon name={sala.detalle.icono} className="text-[16px]" />
            {sala.detalle.texto}
          </span>
        </div>

        <div className="flex items-center justify-between pt-space-xs">
          <ul className="flex -space-x-2" aria-label={`${sala.presentes} ${sala.presentes === 1 ? "persona presente" : "personas presentes"}`}>
            {sala.iniciales.map((ini, i) => (
              <li
                key={`${ini}-${i}`}
                aria-hidden="true"
                className={`h-7 w-7 rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center font-label text-label-sm font-bold ${tonoIniciales(i)}`}
              >
                {ini}
              </li>
            ))}
            {extra > 0 && (
              <li aria-hidden="true" className="h-7 w-7 rounded-full ring-2 ring-surface-container-lowest bg-surface-container text-on-surface-variant flex items-center justify-center font-label text-label-sm font-medium">
                +{extra}
              </li>
            )}
          </ul>
          <span className="font-label text-label-sm text-on-surface-variant">{sala.creada}</span>
        </div>
      </div>

      <div className="bg-surface-container-low px-space-lg py-space-sm flex items-center justify-between gap-space-sm">
        <button
          type="button"
          onClick={() => void copiar(sala.id)}
          aria-label={`Copiar ID ${sala.id}`}
          className="min-h-[40px] inline-flex items-center gap-1.5 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label text-label-md transition-colors"
        >
          <Icon name="content_copy" className="text-[17px]" />
          Copiar ID
        </button>
        <Link
          to={`/salas/${sala.id}`}
          aria-label={`Entrar a ${sala.nombre}`}
          className="min-h-[40px] inline-flex items-center gap-1.5 px-space-md rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label text-label-md shadow-sm transition-colors"
        >
          Entrar
          <Icon name="arrow_forward" className="text-[18px]" />
        </Link>
      </div>
    </article>
  );
}
