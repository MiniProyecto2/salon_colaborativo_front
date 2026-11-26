import { DATOS_DEMO, esperar } from "./demo";
import { mensajeApi } from "./errores";
import { apiFetch, ApiError } from "./api";

export const URL_TIEMPO_REAL = (import.meta.env.VITE_REALTIME_URL as string | undefined)?.trim();

export type EstadoSala = "en-vivo" | "en-pausa";

export type Sala = {
  /** Código que se comparte para entrar (p. ej. CALC-402). También es el id de la ruta /salas/:id. */
  id: string;
  nombre: string;
  descripcion: string;
  materia: string;
  /** Subtítulo corto de la tarjeta móvil (docente, tipo de grupo…). */
  subtitulo: string;
  estado: EstadoSala;
  presentes: number;
  cupos: number;
  /** Función destacada de la sala: pizarra activa, micrófono libre, audio ambiente… */
  detalle: { icono: string; texto: string };
  /** Etiqueta que reemplaza a «Activa ahora» en móvil (p. ej. «Pomodoro 25/5»). */
  modo: string | null;
  iniciales: string[];
  creada: string;
  publica: boolean;
};

export type NuevaSala = { nombre: string; materia: string; descripcion: string; publica: boolean };

export const MAX_NOMBRE_SALA = 60;
export const MAX_DESCRIPCION_SALA = 140;
export const MATERIAS = [
  "Ingeniería y Ciencias Básicas",
  "Matemáticas y Estadística",
  "Ciencias de la Computación",
  "Ciencias de la Salud",
  "Economía y Administración",
  "Otra disciplina académica",
];

/** Texto para mostrar al estudiante cuando falla una operación de salas. */
export const mensajeSalas = mensajeApi;

export type SalaApi = NuevaSala & { id: string; createdAt: string };

export function mostrarSala(sala: SalaApi): Sala {
  return {
    id: sala.id,
    nombre: sala.nombre,
    materia: sala.materia,
    descripcion: sala.descripcion,
    publica: sala.publica,
    subtitulo: sala.publica ? "Cualquiera con el ID" : "Solo invitados",
    estado: "en-pausa",
    presentes: 0,
    cupos: 8,
    detalle: sala.publica ? { icono: "lock_open", texto: "Acceso abierto" } : { icono: "lock", texto: "Solo invitados" },
    modo: null,
    iniciales: [],
    creada: `Creada el ${new Date(sala.createdAt).toLocaleDateString("es-CO")}`,
  };
}

const EJEMPLO: Sala[] = [
  {
    id: "CALC-402",
    nombre: "Sala de Cálculo Multivariable",
    descripcion: "Preparación para taller de integrales triples, coordenadas cilíndricas y teoremas de Stokes.",
    materia: "Matemáticas Avanzadas",
    subtitulo: "Prof. Miranda • Preparación Control 2",
    estado: "en-vivo",
    presentes: 6,
    cupos: 8,
    detalle: { icono: "mic", texto: "Micro libre" },
    modo: null,
    iniciales: ["CR", "MA", "JL"],
    creada: "Creada hace 2 horas",
    publica: true,
  },
  {
    id: "PROJ-918",
    nombre: "Proyecto Integrador I - Sprint Review",
    descripcion: "Revisión conjunta de arquitectura de microservicios y despliegue en Kubernetes.",
    materia: "Ingeniería de Software",
    subtitulo: "Grupo de Estudio Silencioso",
    estado: "en-vivo",
    presentes: 4,
    cupos: 5,
    detalle: { icono: "draw", texto: "Pizarra activa" },
    modo: "Pomodoro 25/5",
    iniciales: ["DA", "SO", "FB"],
    creada: "Creada ayer",
    publica: true,
  },
  {
    id: "ALGO-104",
    nombre: "Algoritmos y Complejidad ALGO-104",
    descripcion: "Resolución de grafos ponderados, Dijkstra, Bellman-Ford y análisis de complejidad asintótica.",
    materia: "Ciencias de la Computación",
    subtitulo: "Repaso individual",
    estado: "en-pausa",
    presentes: 1,
    cupos: 6,
    detalle: { icono: "lock_open", texto: "Acceso abierto" },
    modo: null,
    iniciales: ["CR"],
    creada: "Creada hace 3 días",
    publica: false,
  },
];

// Salas en memoria para el modo de demostración.
let almacen: Sala[] = DATOS_DEMO ? EJEMPLO.map((s) => ({ ...s })) : [];

export async function listarMisSalas(): Promise<Sala[]> {
  if (!DATOS_DEMO) return (await apiFetch<SalaApi[]>("/rooms")).map(mostrarSala);
  await esperar(700);
  return almacen.map((s) => ({ ...s }));
}

function generarCodigo(nombre: string): string {
  const base = nombre.normalize("NFD").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4).padEnd(4, "X");
  for (;;) {
    const codigo = `${base}-${Math.floor(100 + Math.random() * 900)}`;
    if (!almacen.some((s) => s.id === codigo)) return codigo;
  }
}

export async function crearSala(datos: NuevaSala, iniciales: string): Promise<Sala> {
  if (!DATOS_DEMO) return mostrarSala(await apiFetch<SalaApi>("/rooms", { method: "POST", body: datos }));
  await esperar(900);
  const sala: Sala = {
    id: generarCodigo(datos.nombre),
    nombre: datos.nombre,
    descripcion: datos.descripcion || "Sala de estudio colaborativo.",
    materia: datos.materia,
    subtitulo: datos.publica ? "Cualquiera con el ID" : "Solo invitados",
    estado: "en-pausa",
    presentes: 1,
    cupos: 8,
    detalle: datos.publica ? { icono: "lock_open", texto: "Acceso abierto" } : { icono: "lock", texto: "Solo invitados" },
    modo: null,
    iniciales: [iniciales],
    creada: "Creada ahora mismo",
    publica: datos.publica,
  };
  almacen = [sala, ...almacen];
  return { ...sala };
}

export async function renombrarSala(id: string, nombre: string): Promise<void> {
  if (!DATOS_DEMO) return apiFetch<void>(`/rooms/${encodeURIComponent(id)}`, { method: "PATCH", body: { nombre } });
  await esperar(500);
  almacen = almacen.map((s) => (s.id === id ? { ...s, nombre } : s));
}

export async function eliminarSala(id: string): Promise<void> {
  if (!DATOS_DEMO) return apiFetch<void>(`/rooms/${encodeURIComponent(id)}`, { method: "DELETE" });
  await esperar(600);
  almacen = almacen.filter((s) => s.id !== id);
}

export async function consultarSala(id: string): Promise<void> {
  if (!DATOS_DEMO) {
    await apiFetch<SalaApi>(`/rooms/${encodeURIComponent(id)}`);
    return;
  }
  await esperar(500);
  if (!almacen.some((sala) => sala.id === id)) throw new ApiError("http", 404);
}
