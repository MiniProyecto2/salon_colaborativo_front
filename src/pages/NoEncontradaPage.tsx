import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useSesion } from "../hooks/useSesion";

export default function NoEncontradaPage() {
  useDocumentTitle("Página no encontrada");
  const { haySesion } = useSesion();

  return (
    <div className="max-w-[680px] mx-auto px-margin-mobile md:px-margin py-16 md:py-24">
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-8 md:p-12 flex flex-col items-center text-center gap-4">
        <div aria-hidden="true" className="w-16 h-16 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
          <Icon name="explore_off" className="text-[36px]" />
        </div>
        <p className="font-headline text-5xl md:text-6xl font-bold text-primary">404</p>
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-background tracking-tight">Página no encontrada</h1>
        <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed max-w-md">
          La dirección que abriste no existe o fue movida. Revisa que esté bien escrita o vuelve al inicio.
        </p>
        <Link
          to={haySesion ? "/dashboard" : "/"}
          className="mt-2 min-h-[48px] px-6 py-3 bg-primary-container text-on-primary font-label text-sm font-semibold rounded-lg shadow-sm hover:bg-primary transition-colors inline-flex items-center justify-center gap-2"
        >
          <Icon name="arrow_back" className="text-[20px]" />
          {haySesion ? "Ir al Panel" : "Ir a Bienvenida"}
        </Link>
      </div>
    </div>
  );
}
