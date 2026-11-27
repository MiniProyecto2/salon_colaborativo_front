import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../lib/api";
import { consultarSala } from "../../lib/salas";
import Button from "../ui/Button";
import TextField from "../ui/TextField";

export default function FormularioUnirse() {
  const navegar = useNavigate();
  const campo = useRef<HTMLInputElement>(null);
  const [id, setId] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unirse(evento: FormEvent) {
    evento.preventDefault();
    if (cargando) return;
    const limpio = id.trim();
    if (!limpio || !/^[A-Za-z0-9-]{20}$/.test(limpio)) {
      setError("Escribe el ID que te compartió el anfitrión.");
      campo.current?.focus();
      return;
    }
    setError(null);
    setCargando(true);
    try {
      const sala =await consultarSala(limpio);
      navegar(`/salas/${encodeURIComponent(sala.id)}`);
    } catch (fallo) {
      setError(fallo instanceof ApiError && fallo.status === 404
        ? "No encontramos esa sala. Revisa el ID con el anfitrión."
        : fallo instanceof ApiError && fallo.status === 403
          ? "La sala es privada. Pide ayuda al anfitrión."
          : "No pudimos buscar la sala. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <section aria-label="Unirse a una sala" className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <form onSubmit={unirse} noValidate className="flex flex-col gap-space-sm sm:flex-row sm:items-start">
        <div className="flex-1 min-w-0">
          <TextField
            ref={campo}
            etiqueta="ID de la sala"
            ayuda="Pide el ID al anfitrión."
            valor={id}
            onCambio={(valor) => { setId(valor); setError(null); }}
            autoComplete="off"
            maxLength={80}
            disabled={cargando}
            error={error}
          />
        </div>
        <Button className="sm:mt-7" variante="secondary" type="submit" icono="arrow_forward" cargando={cargando} textoCargando="Buscando la sala…">
          Unirse a la sala
        </Button>
        <span className="sr-only" role="status">{cargando ? "Buscando la sala…" : error}</span>
      </form>
    </section>
  );
}
