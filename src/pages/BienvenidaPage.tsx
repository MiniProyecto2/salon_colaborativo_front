import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useMediaQuery } from "../hooks/useMediaQuery";
import BienvenidaDesktop from "./BienvenidaDesktop";
import BienvenidaMovil from "./BienvenidaMovil";

export default function BienvenidaPage() {
  useDocumentTitle("Bienvenida");
  const esMovil = useMediaQuery("(max-width: 767px)"); // mismo corte que "md" de Tailwind
  return esMovil ? <BienvenidaMovil /> : <BienvenidaDesktop />;
}
