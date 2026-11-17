import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-primary-container rounded-lg py-1 px-1 -ml-1"
    >
      <Icon name="menu_book" className="text-[28px] md:text-[32px]" />
      <span className="font-headline font-semibold text-lg md:text-xl tracking-tight">Salón de Estudio</span>
    </Link>
  );
}
