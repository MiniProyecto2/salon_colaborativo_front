import { useState } from "react";
import { Link } from "react-router-dom";
import { useCopiar } from "../../hooks/useCopiar";
import type { Sala } from "../../lib/salas";
import Icon from "../Icon";

type Props = { sala: Sala; indice: number; onRenombrar: (s: Sala) => void; onEliminar: (s: Sala) => void };

/** Tarjeta de sala para móvil y tableta. */
export default function TarjetaSalaMovil({ sala, indice, onRenombrar, onEliminar }: Props) {
  const copiar = useCopiar();
  const [menu, setMenu] = useState(false);
  const idMenu = `menu-${sala.id}`;
  const enVivo = sala.estado === "en-vivo";

  return (
    <article className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
      <div aria-hidden="true" className={`absolute top-0 left-0 w-1.5 h-full ${indice % 2 === 0 ? "bg-primary" : "bg-secondary"}`} />

      <div className="flex items-start justify-between gap-space-xs pl-1">
        <div className="flex flex-col min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            {sala.modo ? (
              <span className="px-2 py-0.5 rounded-full font-label text-label-sm bg-primary-fixed text-on-primary-fixed font-semibold flex items-center gap-1">
                <Icon name="timer" className="text-[14px]" />
                {sala.modo}
              </span>
            ) : (
              <span
                className={`px-2 py-0.5 rounded-full font-label text-label-sm font-semibold flex items-center gap-1 ${
                  enVivo ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container text-on-surface-variant"
                }`}
              >
                <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${enVivo ? "bg-secondary animate-pulse" : "bg-outline"}`} />
                {enVivo ? "Activa ahora" : "En pausa"}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full font-label text-label-sm bg-surface-container-high text-on-surface-variant">
              {sala.presentes} / {sala.cupos} cupos
            </span>
          </div>
          <h3 className="font-headline text-headline-sm font-semibold text-on-surface break-words">{sala.nombre}</h3>
          <p className="font-body text-body-sm text-on-surface-variant">{sala.subtitulo}</p>
        </div>
        <button
          type="button"
          aria-expanded={menu}
          aria-controls={idMenu}
          aria-label={`Opciones de la sala ${sala.nombre}`}
          onClick={() => setMenu((v) => !v)}
          className="w-11 h-11 -mr-2 -mt-1 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <Icon name="more_vert" className="text-[22px]" />
        </button>
      </div>

      {menu && (
        <div id={idMenu} className="w-full bg-surface-container p-space-xs rounded-lg flex items-center justify-around font-label text-label-md">
          <button
            type="button"
            onClick={() => {
              setMenu(false);
              onRenombrar(sala);
            }}
            className="min-h-[44px] flex items-center gap-1 px-3 rounded hover:bg-surface-container-high transition-colors text-on-surface"
          >
            <Icon name="edit" className="text-[18px] text-primary" />
            Editar nombre
          </button>
          <button
            type="button"
            onClick={() => {
              setMenu(false);
              onEliminar(sala);
            }}
            className="min-h-[44px] flex items-center gap-1 px-3 rounded text-error hover:bg-error-container/40 transition-colors"
          >
            <Icon name="delete" className="text-[18px]" />
            Eliminar
          </button>
        </div>
      )}

      <div
        aria-hidden="true"
        className="w-full h-24 rounded-lg overflow-hidden relative bg-gradient-to-br from-inverse-surface via-primary-container to-primary"
      >
        <Icon name="school" className="absolute right-3 top-2 text-[56px] text-on-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 via-transparent to-transparent flex items-end p-2.5">
          <div className="flex items-center gap-2 text-surface-bright font-label text-label-sm">
            <Icon name={sala.detalle.icono} className="text-[16px] text-secondary-fixed" />
            {sala.detalle.texto}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-space-xs pt-1">
        <button
          type="button"
          onClick={() => void copiar(sala.id, "ID")}
          aria-label={`Copiar ID ${sala.id}`}
          className="min-h-[44px] px-space-md rounded-lg bg-surface-container-low text-on-surface font-label text-label-md flex items-center min-w-0 gap-1.5 active:bg-surface-container-highest transition-colors"
        >
          <Icon name="content_copy" className="text-[18px] text-primary" />
          <span className="wrap-anywhere">{sala.id}</span>
        </button>
        <Link
          to={`/salas/${sala.id}`}
          className="min-h-[44px] flex-1 px-space-md bg-primary text-on-primary rounded-lg font-label text-label-md flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform"
        >
          Entrar a la sala
          <span className="sr-only"> {sala.nombre}</span>
          <Icon name="meeting_room" className="text-[18px]" />
        </Link>
      </div>
    </article>
  );
}
