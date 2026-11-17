import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import FormularioPerfil from "../components/perfil/FormularioPerfil";
import AvatarPerfil from "../components/perfil/AvatarPerfil";
import GraficoSemanal from "../components/perfil/GraficoSemanal";
import { DATOS_DEMO } from "../lib/demo";
import { fechaLarga, miembroDesde, type PerfilVistaProps } from "./perfilTipos";

export default function PerfilEscritorio({ perfil, estadisticas: est, ultimoAcceso, proveedor, editando, onEditar, onCancelarEdicion, onGuardado, onEliminarCuenta, aviso }: PerfilVistaProps) {
  const desde = miembroDesde(perfil.createdAt);
  const acceso = fechaLarga(ultimoAcceso);
  const totalSemana = est.horasSemana.reduce((n, d) => n + d.horas, 0);
  const hoy = (new Date().getDay() + 6) % 7; // lunes = 0
  const metricas = [
    { etiqueta: "Salas creadas", valor: String(est.salasCreadas), nota: `${est.salasPublicas} públicas • ${est.salasPrivadas} privada${est.salasPrivadas === 1 ? "" : "s"}`, icono: "meeting_room", color: "text-primary-container", notaColor: "text-secondary" },
    { etiqueta: "Horas de estudio", valor: `${est.horasEstudio}h`, nota: "En pizarras y audio activo", icono: "timelapse", color: "text-secondary", notaColor: "text-on-surface-variant" },
    { etiqueta: "Sesiones completadas", valor: String(est.sesionesCompletadas), nota: "Sesiones de estudio cerradas", icono: "task_alt", color: "text-on-secondary-fixed-variant", notaColor: "text-on-surface-variant" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-space-lg xl:px-margin py-space-xl flex flex-col gap-space-xl">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <nav aria-label="Ruta de navegación" className="flex items-center gap-space-xs font-label text-label-md text-on-surface-variant">
            <Link to="/dashboard" className="hover:text-primary transition-colors">Panel principal</Link>
            <Icon name="chevron_right" className="text-[16px]" />
            <span aria-current="page" className="text-on-surface font-semibold">Gestión de perfil y cuenta</span>
          </nav>
          <div className="flex flex-wrap items-center gap-space-sm mt-1">
            <h1 className="font-headline text-headline-xl text-on-surface font-bold">Expediente de usuario</h1>
            <span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label text-label-sm font-semibold">Cuenta activa</span>
          </div>
          <p className="font-body text-body-md text-on-surface-variant max-w-2xl">
            Administra tus datos, tu apariencia en las salas de estudio y la configuración de tu cuenta.
          </p>
        </div>
        <div className="flex items-center gap-space-md p-space-sm pr-space-md rounded-xl bg-surface-container-low shadow-sm self-start">
          <span aria-hidden="true" className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-container">
            <Icon name="verified_user" className="text-[24px]" />
          </span>
          <div>
            <span className="block font-label text-label-md text-on-surface-variant uppercase tracking-wider">Inicio de sesión</span>
            <span className="block font-label text-label-lg text-on-surface font-semibold">{proveedor}</span>
          </div>
        </div>
      </section>

      {aviso}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <section className="lg:col-span-8 flex flex-col gap-space-xl">
          <article className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg md:p-space-xl relative overflow-hidden">
            <div aria-hidden="true" className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />

            {editando ? (
              <div className="relative">
                <FormularioPerfil perfil={perfil} onCancelar={onCancelarEdicion} onGuardado={onGuardado} />
              </div>
            ) : (
              <div className="relative flex flex-col gap-space-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-lg">
                  <div className="flex items-start sm:items-center gap-space-lg min-w-0">
                    <div className="relative shrink-0">
                      <AvatarPerfil foto={perfil.photoURL} nombre={perfil.displayName} />
                      <span aria-hidden="true" className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary w-7 h-7 rounded-full flex items-center justify-center shadow-sm">
                        <Icon name="school" className="text-[16px]" />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <h2 className="font-headline text-headline-md text-on-surface font-semibold break-words">{perfil.displayName}</h2>
                      <span className="font-label text-label-lg text-primary font-semibold break-all">@{perfil.username}</span>
                      {perfil.email && (
                        <span className="flex items-center gap-1.5 font-body text-body-sm text-on-surface-variant mt-1 break-all">
                          <Icon name="mail" className="text-[18px] shrink-0" />
                          {perfil.email}
                        </span>
                      )}
                      <span className="flex flex-wrap items-center gap-2 mt-1">
                        <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        <span className="font-label text-label-sm text-secondary font-semibold uppercase tracking-wider">Cuenta activa</span>
                        {desde && <span className="text-on-surface-variant font-label text-label-sm">• Miembro desde {desde}</span>}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onEditar}
                    className="min-h-[48px] shrink-0 inline-flex items-center gap-space-xs px-space-lg rounded-lg bg-primary-container text-on-primary font-label text-label-lg hover:bg-primary shadow-sm transition-colors"
                  >
                    <Icon name="edit" className="text-[20px]" />
                    Editar perfil
                  </button>
                </div>

                <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                  <h3 className="font-label text-label-sm text-on-surface-variant font-semibold tracking-wider uppercase">Biografía académica</h3>
                  {perfil.bio ? (
                    <p className="font-body text-body-md text-on-surface italic break-words">“{perfil.bio}”</p>
                  ) : (
                    <p className="font-body text-body-md text-on-surface-variant">
                      Aún no escribiste tu biografía. Cuéntales a tus compañeros qué estudias.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-space-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-headline text-headline-sm text-on-surface font-semibold">Métricas de estudio colaborativo</h3>
                    <span className="font-label text-label-sm text-on-surface-variant">
                      {DATOS_DEMO ? "Datos de ejemplo" : "Se actualizan con tu actividad"}
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                    {metricas.map((m) => (
                      <li key={m.etiqueta} className="p-space-lg rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm">
                        <div className="flex items-start justify-between gap-2 text-on-surface-variant">
                          <span className="font-label text-label-md">{m.etiqueta}</span>
                          <Icon name={m.icono} className={`${m.color} text-[24px]`} />
                        </div>
                        <div className="mt-space-md">
                          <span className="font-headline text-headline-xl text-on-surface font-bold block">{m.valor}</span>
                          <span className={`font-label text-label-sm font-medium ${m.notaColor}`}>{m.nota}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {est.asignaturas.length > 0 && (
                  <div className="flex flex-col gap-space-xs">
                    <h3 className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Asignaturas de enfoque principal</h3>
                    <ul className="flex flex-wrap gap-space-xs">
                      {est.asignaturas.map((a) => (
                        <li key={a.nombre} className="px-space-sm py-1 rounded-full bg-surface-container font-label text-label-sm text-on-surface font-medium flex items-center gap-1">
                          <Icon name={a.icono} className="text-[16px] text-primary" />
                          {a.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </article>

          <article aria-labelledby="zona-sensible" className="bg-surface-container-low rounded-xl shadow-sm p-space-lg md:p-space-xl flex flex-col gap-space-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-space-sm">
                <Icon name="shield" className="text-error text-[28px]" />
                <h2 id="zona-sensible" className="font-headline text-headline-sm text-on-surface font-semibold">Seguridad y gestión crítica de cuenta</h2>
              </div>
              <span className="px-3 py-1 rounded bg-error-container text-on-error-container font-label text-label-sm font-bold uppercase tracking-wider">Zona sensible</span>
            </div>
            <p className="font-body text-body-md text-on-surface-variant">
              La eliminación de tu cuenta es permanente e irreversible: se borran tus datos personales y se libera tu nombre de usuario.
            </p>
            <div className="flex items-start gap-space-sm p-space-md rounded-lg bg-surface-container-lowest shadow-sm">
              <span aria-hidden="true" className="w-10 h-10 shrink-0 rounded-lg bg-error-container text-error flex items-center justify-center">
                <Icon name="lock_reset" className="text-[24px]" />
              </span>
              <div>
                <h3 className="font-label text-label-lg text-on-surface font-semibold">Retención y privacidad de datos</h3>
                <p className="font-body text-body-sm text-on-surface-variant">
                  Al solicitar la baja se revocan tus sesiones abiertas, se libera tu nombre de usuario y las salas que administras se cierran para todos los participantes.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pt-space-xs">
              {acceso && <p className="font-label text-label-sm text-on-surface-variant">Último acceso: {acceso}</p>}
              <button
                type="button"
                onClick={onEliminarCuenta}
                className="min-h-[48px] shrink-0 inline-flex items-center justify-center gap-space-xs px-space-lg rounded-lg bg-error text-on-error font-label text-label-lg hover:opacity-90 shadow-sm transition-opacity md:ml-auto"
              >
                <Icon name="person_remove" className="text-[20px]" />
                Eliminar cuenta
              </button>
            </div>
          </article>
        </section>

        <aside aria-label="Actividad y certificación" className="lg:col-span-4 flex flex-col gap-space-lg">
          <article className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <div aria-hidden="true" className="h-28 bg-gradient-to-br from-inverse-surface via-primary-container to-primary flex items-end p-space-md">
              <span className="font-headline text-headline-sm text-on-primary font-semibold">Mis salas activas</span>
            </div>
            <div className="p-space-md flex flex-col gap-space-sm">
              <h2 className="font-label text-label-md text-on-surface-variant">Salas vinculadas actualmente</h2>
              {est.salasVinculadas.length > 0 ? (
                <ul className="flex flex-col gap-space-sm">
                  {est.salasVinculadas.map((s) => (
                    <li key={s.nombre} className="flex items-center justify-between gap-2 p-space-sm rounded-lg bg-surface-container-low">
                      <span className="flex items-center gap-space-sm min-w-0">
                        <Icon name={s.icono} className="text-primary text-[20px] shrink-0" />
                        <span className="min-w-0">
                          <span className="block font-label text-label-lg text-on-surface truncate">{s.nombre}</span>
                          <span className="block font-label text-label-sm text-on-surface-variant">{s.participantes} participantes activos</span>
                        </span>
                      </span>
                      <span className="font-label text-label-sm text-secondary font-semibold shrink-0">{s.publica ? "Pública" : "Privada"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-body text-body-sm text-on-surface-variant">Todavía no estás en ninguna sala.</p>
              )}
              <Link to="/dashboard" className="min-h-[44px] inline-flex items-center justify-center gap-1 font-label text-label-lg text-primary font-semibold hover:underline">
                Gestionar todas mis salas
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>
          </article>

          <article className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-headline text-headline-sm text-on-surface font-semibold">Horas de estudio semanal</h2>
              <span className="font-label text-label-sm text-secondary font-semibold text-right whitespace-nowrap">Meta: {est.metaSemanal} h</span>
            </div>
            <GraficoSemanal datos={est.horasSemana} hoy={hoy} />
            <div className="flex items-center justify-between font-label text-label-sm text-on-surface-variant">
              <span>
                Total registrado: <strong className="text-on-surface">{totalSemana} horas</strong>
              </span>
              {totalSemana >= est.metaSemanal && (
                <span className="flex items-center gap-1 text-secondary font-semibold">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-secondary" />
                  Meta cumplida
                </span>
              )}
            </div>
          </article>

          <article className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-xs">
            <h2 className="flex items-center gap-2 font-label text-label-lg text-on-surface font-semibold">
              <Icon name="workspace_premium" className="text-secondary text-[22px]" />
              Accesibilidad
            </h2>
            <p className="font-body text-body-sm text-on-surface-variant">
              El Salón de Estudio sigue los criterios WCAG 2.2 AA para navegar con teclado y con lectores de pantalla.{" "}
              <Link to="/accesibilidad" className="text-primary font-semibold underline underline-offset-2">Leer la declaración</Link>.
            </p>
          </article>
        </aside>
      </div>
    </div>
  );
}
