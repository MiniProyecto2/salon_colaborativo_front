import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import Icon from "../Icon";
import SalaDemostracion from "../SalaDemostracion";

type Props = {
  titulo: string;
  descripcion?: string;
  icono?: string;
  volverA?: { to: string; texto: string };
  /** Muestra las pestañas «Crear cuenta / Iniciar sesión» con la pestaña indicada activa. */
  pestana?: "registro" | "login";
  children: ReactNode;
};

const HERRAMIENTAS = [
  { icono: "chat_bubble_outline", titulo: "Chat de la sala", texto: "Conversa y recupera el historial sin perder el hilo del debate." },
  { icono: "videocam", titulo: "Video y audio", texto: "Mira y escucha a tu grupo en tiempo real, directamente desde el navegador." },
  { icono: "present_to_all", titulo: "Compartir pantalla", texto: "Presenta guías, diapositivas o código sin salir de la sala." },
];

const CIFRAS = [
  { valor: "WCAG 2.2 AA", titulo: "Accesible para todos", texto: "Pensado para teclado y lectores de pantalla", color: "text-primary" },
  { valor: "Tiempo real", titulo: "Chat, audio y video", texto: "Sincronizados con todo tu grupo", color: "text-secondary" },
  { valor: "0 descargas", titulo: "Directo en tu navegador", texto: "Ingreso rápido sin instalaciones", color: "text-on-surface" },
];

const pestanaClase = (activa: boolean) =>
  `flex-1 min-h-[44px] rounded-lg flex items-center justify-center gap-2 font-label text-label-lg transition-colors ${
    activa ? "bg-primary-container text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
  }`;

/**
 * Estructura común de las pantallas de acceso.
 * Escritorio: tarjeta con el formulario + panel con sala de ejemplo. Móvil: una sola columna.
 */
export default function AuthCard({ titulo, descripcion, icono, volverA, pestana, children }: Props) {
  useDocumentTitle(titulo);

  return (
    <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin py-6 lg:py-10 flex flex-col gap-space-xl">
      <div className="hidden lg:flex items-center justify-between">
        <span className="inline-flex items-center gap-2 px-space-md py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label text-label-sm font-bold uppercase tracking-wider">
          <Icon name="school" className="text-[16px]" />
          Entorno universitario colaborativo
        </span>
        <span className="flex items-center gap-1 font-label text-label-sm text-on-surface-variant">
          <Icon name="verified" className="text-[16px] text-secondary" />
          Conformidad WCAG 2.2 AA
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-7 min-w-0">
          {volverA && (
            <Link
              to={volverA.to}
              className="inline-flex items-center gap-1 min-h-[44px] mb-2 text-primary font-label text-sm rounded-lg hover:underline"
            >
              <Icon name="arrow_back" className="text-[20px]" />
              {volverA.texto}
            </Link>
          )}

          <div className="flex flex-col gap-space-md lg:gap-space-lg lg:bg-surface-container-lowest lg:rounded-2xl lg:shadow-sm lg:p-space-xl">
            {pestana && (
              <nav aria-label="Acceso a la plataforma" className="hidden lg:flex gap-1 p-1 rounded-xl bg-surface-container">
                <Link to="/registro" aria-current={pestana === "registro" ? "page" : undefined} className={pestanaClase(pestana === "registro")}>
                  <Icon name="person_add" className="text-[18px]" />
                  Crear cuenta
                </Link>
                <Link to="/iniciar-sesion" aria-current={pestana === "login" ? "page" : undefined} className={pestanaClase(pestana === "login")}>
                  <Icon name="login" className="text-[18px]" />
                  Iniciar sesión
                </Link>
              </nav>
            )}

            <header className="max-lg:bg-surface-container-lowest max-lg:rounded-2xl max-lg:p-space-lg max-lg:shadow-sm flex flex-col gap-space-sm">
              {icono && (
                <div aria-hidden="true" className="lg:hidden w-12 h-12 rounded-xl bg-primary-fixed text-primary-container flex items-center justify-center">
                  <Icon name={icono} className="text-[28px]" />
                </div>
              )}
              <h1 className="font-headline text-headline-md lg:text-headline-lg font-bold text-on-surface tracking-tight">{titulo}</h1>
              {descripcion && <p className="font-body text-body-md text-on-surface-variant">{descripcion}</p>}
            </header>

            {children}
          </div>
        </div>

        <aside aria-label="Sobre el Salón de Estudio" className="hidden lg:flex lg:col-span-5 flex-col gap-space-lg">
          <SalaDemostracion />
          <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div>
              <span className="font-label text-label-sm text-primary font-bold uppercase tracking-wider">Herramientas esenciales</span>
              <h2 className="font-headline text-headline-sm text-on-surface font-bold">Estudia con tu grupo, como en un salón real</h2>
            </div>
            <ul className="flex flex-col gap-space-md">
              {HERRAMIENTAS.map((h) => (
                <li key={h.titulo} className="flex items-start gap-space-sm">
                  <span aria-hidden="true" className="w-9 h-9 shrink-0 rounded-lg bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center">
                    <Icon name={h.icono} className="text-[20px]" />
                  </span>
                  <span>
                    <span className="block font-label text-label-lg text-on-surface font-semibold">{h.titulo}</span>
                    <span className="block font-body text-body-sm text-on-surface-variant">{h.texto}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <ul className="hidden lg:grid grid-cols-3 gap-space-lg bg-surface-container-low rounded-2xl p-space-xl text-center">
        {CIFRAS.map((c) => (
          <li key={c.valor}>
            <span className={`block font-headline text-headline-lg font-bold ${c.color}`}>{c.valor}</span>
            <span className="block font-label text-label-lg text-on-surface font-semibold">{c.titulo}</span>
            <span className="block font-body text-body-sm text-on-surface-variant">{c.texto}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
