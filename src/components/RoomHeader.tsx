import Button from "./ui/Button";
import LinkButton from "./ui/LinkButton";
import { useCopiar } from "../hooks/useCopiar";

export default function RoomHeader({ id, nombre }: { id: string; nombre?: string }) {
  const copiar = useCopiar();

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest shadow-sm">
      <div className="mx-auto max-w-[1200px] px-margin-mobile md:px-margin py-space-sm flex flex-wrap items-center justify-between gap-space-xs">
        <div className="min-w-0">
          <h1 className="font-headline font-semibold text-lg md:text-2xl wrap-anywhere">{nombre ?? "Unirse a una sala"}</h1>
          <p className="text-sm text-on-surface-variant wrap-anywhere">ID de la sala <strong className="select-all">{id}</strong></p>
        </div>
        <div className="flex flex-wrap items-center gap-space-xs [&>*]:w-auto">
          {nombre && <Button variante="secondary" icono="content_copy" onClick={() => void copiar(id, "ID")}>Copiar ID</Button>}
          <LinkButton to="/dashboard" variante="secondary" icono="logout">
            Salir de la sala
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
