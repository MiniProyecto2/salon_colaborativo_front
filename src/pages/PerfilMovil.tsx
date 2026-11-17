import Icon from "../components/Icon";
import AvatarPerfil from "../components/perfil/AvatarPerfil";
import FormularioPerfil from "../components/perfil/FormularioPerfil";
import { DATOS_DEMO } from "../lib/demo";
import type { PerfilVistaProps } from "./perfilTipos";

export default function PerfilMovil({ perfil, estadisticas: est, editando, onEditar, onCancelarEdicion, onGuardado, onEliminarCuenta, aviso }: PerfilVistaProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-gutter-mobile py-space-md flex flex-col gap-space-md">
      {aviso}
      <h1 className="sr-only">Mi perfil</h1>

      {editando ? (
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg">
          <FormularioPerfil perfil={perfil} onCancelar={onCancelarEdicion} onGuardado={onGuardado} />
        </section>
      ) : (
        <>
          <section className="relative overflow-hidden bg-surface-container-lowest rounded-2xl shadow-md p-space-lg flex flex-col items-center text-center gap-space-sm">
            <div aria-hidden="true" className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none" />
            <div aria-hidden="true" className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-primary-fixed/50 blur-3xl pointer-events-none" />
            <div className="relative">
              <AvatarPerfil foto={perfil.photoURL} nombre={perfil.displayName} redondo className="w-28 h-28" />
              <span aria-hidden="true" className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-md">
                <Icon name="workspace_premium" className="text-[22px]" />
              </span>
            </div>
            <span className="relative inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label text-label-lg font-semibold">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-secondary" />
              Cuenta activa
            </span>
            <h2 className="relative font-headline text-headline-xl-mobile text-on-surface font-bold break-words max-w-full">{perfil.displayName}</h2>
            <p className="relative font-label text-body-md text-primary font-semibold break-all">@{perfil.username}</p>
            {perfil.email && (
              <p className="relative flex items-center gap-1.5 font-body text-body-sm text-on-surface-variant break-all">
                <Icon name="mail" className="text-[18px] shrink-0" />
                {perfil.email}
              </p>
            )}
            {perfil.bio && <p className="relative font-body text-body-sm text-on-surface italic break-words">“{perfil.bio}”</p>}

            <div className="relative w-full mt-space-sm rounded-xl bg-surface-container-low p-space-sm">
              <ul className="grid grid-cols-2 gap-space-sm">
                {[
                  { icono: "meeting_room", fondo: "bg-primary-fixed text-primary", valor: String(est.salasCreadas), texto: "Salas activas" },
                  { icono: "timer", fondo: "bg-secondary-fixed text-on-secondary-fixed-variant", valor: `${est.horasEstudio}h`, texto: "Estudio total" },
                ].map((m) => (
                  <li key={m.texto} className="flex items-center gap-space-sm bg-surface-container-lowest rounded-lg p-space-sm text-left">
                    <span aria-hidden="true" className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${m.fondo}`}>
                      <Icon name={m.icono} className="text-[22px]" />
                    </span>
                    <span>
                      <span className="block font-headline text-headline-sm text-on-surface font-bold leading-tight">{m.valor}</span>
                      <span className="block font-label text-label-sm text-on-surface-variant">{m.texto}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {DATOS_DEMO && <p className="font-label text-label-sm text-on-surface-variant mt-2">Datos de ejemplo</p>}
            </div>
          </section>

          <section aria-label="Racha de concentración" className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex items-center gap-space-md">
            <span aria-hidden="true" className="w-14 h-14 shrink-0 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <Icon name="local_fire_department" className="text-[30px]" />
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="font-headline text-body-lg text-on-surface font-semibold">Racha de concentración</h2>
              <p className="font-body text-body-sm text-on-surface-variant">
                {est.rachaDias > 0 ? `${est.rachaDias} días consecutivos completados` : "Completa una sesión hoy para empezar tu racha"}
              </p>
            </div>
            <span className="font-headline text-headline-md text-tertiary font-bold shrink-0">{est.rachaDias}d</span>
          </section>

          <button
            type="button"
            onClick={onEditar}
            className="min-h-[56px] w-full rounded-xl bg-primary-container text-on-primary font-label text-label-lg font-semibold shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Icon name="edit" className="text-[22px]" />
            Editar perfil
          </button>

          <section aria-labelledby="gestion-cuenta" className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex flex-col gap-space-sm">
            <h2 id="gestion-cuenta" className="flex items-center gap-2 font-label text-label-lg text-on-surface-variant font-semibold uppercase tracking-wider">
              <Icon name="shield" className="text-[20px]" />
              Gestión de cuenta
            </h2>
            <p className="font-body text-body-md text-on-surface-variant">
              Tu perfil está vinculado a tu cuenta del Salón de Estudio. Puedes solicitar la baja definitiva de tu cuenta y tus datos.
            </p>
            <button
              type="button"
              onClick={onEliminarCuenta}
              className="min-h-[52px] w-full rounded-lg bg-surface-container-high text-error font-label text-label-lg font-semibold flex items-center justify-center gap-2 hover:bg-error-container transition-colors"
            >
              <Icon name="delete_forever" className="text-[22px]" />
              Eliminar cuenta
            </button>
          </section>
        </>
      )}
    </div>
  );
}
