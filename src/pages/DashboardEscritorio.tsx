import { URL_TIEMPO_REAL } from "../lib/salas";
import FormularioUnirse from "../components/salas/FormularioUnirse";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import EstadoVacio from "../components/ui/EstadoVacio";
import { SalasCargandoEscritorio } from "../components/salas/SalasCargando";
import TarjetaSala from "../components/salas/TarjetaSala";
import { MAX_SALAS, type PanelProps } from "./panelTipos";

const botonPrimario =
  "min-h-[48px] inline-flex items-center justify-center gap-2 px-space-lg rounded-lg bg-primary-container text-on-primary font-label text-label-lg shadow-sm hover:bg-primary transition-colors active:scale-[0.98] aria-disabled:opacity-60 aria-disabled:pointer-events-none";

const HERRAMIENTAS = [
  {
    icono: "draw",
    fondo: "bg-primary-fixed text-primary",
    titulo: "Pizarra infinita compartida",
    texto:
      "Dibuja esquemas conceptuales, importa archivos PDF y resuelve demostraciones matemáticas simultáneamente con punteros colaborativos identificados.",
    pie: "enlace",
  },
  {
    icono: "timer",
    fondo: "bg-secondary-fixed text-secondary",
    titulo: "Temporizador Pomodoro sincronizado",
    texto:
      "Coordina bloques de concentración de 25 o 50 minutos con descansos planificados. El anfitrión puede pausar o extender los periodos de estudio.",
    pie: "Sincronización entre participantes",
    puntoPie: true,
  },
  {
    icono: "shield_person",
    fondo: "bg-tertiary-fixed text-tertiary",
    titulo: "Moderación y sala de espera",
    texto:
      "Como anfitrión mantienes control total: silencia micrófonos al instante, restringe permisos de dibujo o expulsa participantes no identificados.",
    pie: "Conexión cifrada",
    candado: true,
  },
] as const;

export default function DashboardEscritorio({ estado, salas, limiteAlcanzado, onCrear, onUnirse, onRenombrar, onEliminar, onReintentar }: PanelProps) {
  const conectados = salas.reduce((n, s) => n + s.presentes, 0);
  const enVivo = salas.filter((s) => s.estado === "en-vivo").length;
  const metricas = [
    { etiqueta: "Salas disponibles", valor: String(salas.length), nota: `/ ${MAX_SALAS} máx.`, icono: "meeting_room", icoFondo: "bg-surface-container text-primary-container", destacada: false },
    { etiqueta: "Estudiantes conectados", valor: `${conectados} ${conectados === 1 ? "activo" : "activos"}`, nota: "", icono: "groups", icoFondo: "bg-secondary-fixed text-on-secondary-fixed-variant", destacada: true },
    { etiqueta: "Salas en vivo", valor: String(enVivo), nota: "", icono: "timelapse", icoFondo: "bg-surface-container text-primary-container", destacada: false },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-space-xl py-space-xl flex flex-col gap-space-xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full font-label text-label-sm bg-primary-fixed text-on-primary-fixed font-semibold tracking-wide">
              Panel del anfitrión
            </span>
            <span className="font-label text-label-sm text-on-surface-variant flex items-center gap-1">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-secondary" />
              Servicios en tiempo real activos
            </span>
          </div>
          <h1 className="font-headline text-headline-lg text-on-surface font-bold tracking-tight">Mis salas de estudio</h1>
          <p className="font-body text-body-md text-on-surface-variant max-w-2xl">
            Administra tus espacios colaborativos, modera sesiones activas y comparte enlaces de acceso seguro con tus compañeros de clase.
          </p>
        </div>
        <button
          type="button"
          onClick={onCrear}
          aria-disabled={limiteAlcanzado || undefined}
          title={limiteAlcanzado ? `Alcanzaste el máximo de ${MAX_SALAS} salas` : undefined}
          className={`${botonPrimario} shrink-0`}
        >
          <Icon name="add_circle" className="text-[20px]" />
          Crear nueva sala
        </button>

        <button
          type="button"
          onClick={onUnirse}
          className={`${botonPrimario} shrink-0`}
        >
          <Icon name="add_circle" className="text-[20px]" />
          Unirte a sala existente
        </button>

      </div>


      {estado === "cargando" && <SalasCargandoEscritorio />}

      {estado === "error" && (
        <EstadoVacio
          icono="wifi_off"
          tono="error"
          titulo="No pudimos conectar con el servidor de salas"
          acciones={
            <button type="button" onClick={onReintentar} className={botonPrimario}>
              <Icon name="refresh" className="text-[20px]" />
              Reintentar conexión
            </button>
          }
        >
          Ocurrió un error temporal al cargar tus salas. Comprueba tu conexión de red e inténtalo de nuevo.
        </EstadoVacio>
      )}

      {estado === "listo" && salas.length === 0 && (
        <EstadoVacio
          icono="auto_stories"
          titulo="Aún no tienes salas de estudio creadas"
          acciones={
            <button type="button" onClick={onCrear} className={botonPrimario}>
              <Icon name="add_circle" className="text-[20px]" />
              Crear tu primera sala
            </button>
          }
          pie={
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mt-space-lg max-w-2xl w-full text-left">
              {[
                { icono: "draw", color: "text-secondary", titulo: "Pizarra en vivo", texto: "Dibuja fórmulas y diagramas en tiempo real" },
                { icono: "security", color: "text-primary-container", titulo: "Acceso protegido", texto: "ID único para cada sala" },
                { icono: "volume_up", color: "text-secondary", titulo: "Audio optimizado", texto: "Baja latencia y supresión de eco" },
              ].map((f) => (
                <li key={f.titulo} className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm">
                  <Icon name={f.icono} className={`${f.color} text-[22px]`} />
                  <span>
                    <span className="font-label text-label-md font-semibold text-on-surface block">{f.titulo}</span>
                    <span className="font-label text-label-sm text-on-surface-variant">{f.texto}</span>
                  </span>
                </li>
              ))}
            </ul>
          }
        >
          Crea un espacio virtual seguro con su propio ID. Podrás compartir pizarras sincronizadas, audio libre de ruido y resolver guías junto a tus compañeros.
        </EstadoVacio>
      )}

      {estado === "listo" && salas.length > 0 && (
        <section aria-label="Resumen y salas" className="flex flex-col gap-space-lg">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            {metricas.map((m) => (
              <li key={m.etiqueta} className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
                <div>
                  <span className="font-label text-label-sm text-on-surface-variant block uppercase tracking-wider">{m.etiqueta}</span>
                  <span className={`font-headline text-headline-md font-bold ${m.destacada ? "text-secondary" : "text-on-surface"}`}>
                    {m.valor}{" "}
                    {m.nota && <span className="font-label text-label-md text-secondary font-normal">{m.nota}</span>}
                  </span>
                </div>
                <span aria-hidden="true" className={`w-12 h-12 rounded-lg flex items-center justify-center ${m.icoFondo}`}>
                  <Icon name={m.icono} className="text-[26px]" />
                </span>
              </li>
            ))}
          </ul>
          <ul className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
            {salas.map((sala) => (
              <li key={sala.id} className="flex">
                <TarjetaSala sala={sala} onRenombrar={onRenombrar} onEliminar={onEliminar} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="titulo-herramientas" className="mt-space-lg bg-surface-container-low rounded-2xl p-space-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
          <div>
            <span className="font-label text-label-sm text-primary font-semibold tracking-wider uppercase block">Espacios de alto rendimiento</span>
            <h2 id="titulo-herramientas" className="font-headline text-headline-md text-on-surface font-bold">
              ¿Qué puedes hacer en tu sala de estudio?
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label text-label-sm font-semibold self-start">
            Normativa académica WCAG 2.2 AA
          </span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {HERRAMIENTAS.map((h) => (
            <li key={h.titulo} className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-sm">
              <span aria-hidden="true" className={`w-10 h-10 rounded-lg flex items-center justify-center ${h.fondo}`}>
                <Icon name={h.icono} className="text-[24px]" />
              </span>
              <h3 className="font-headline text-headline-sm text-on-surface font-semibold">{h.titulo}</h3>
              <p className="font-body text-body-sm text-on-surface-variant">{h.texto}</p>
              {h.pie === "enlace" ? (
                <Link to="/pizarra" className="font-label text-label-md text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-auto pt-2 min-h-[44px]">
                  Explorar herramientas
                  <Icon name="chevron_right" className="text-[16px]" />
                </Link>
              ) : (
                <p className="flex items-center gap-2 mt-auto pt-2 text-on-surface-variant font-label text-label-sm">
                  {"candado" in h ? <Icon name="lock" className="text-[16px]" /> : <span aria-hidden="true" className="w-2 h-2 rounded-full bg-secondary" />}
                  {h.pie}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
