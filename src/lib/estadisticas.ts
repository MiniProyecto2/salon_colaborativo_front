import { DATOS_DEMO } from "./demo";

/** Métricas de estudio del Perfil. Sin backend todavía: valores de ejemplo (ver lib/demo.ts). */
export type Estadisticas = {
  salasCreadas: number;
  salasPublicas: number;
  salasPrivadas: number;
  horasEstudio: number;
  sesionesCompletadas: number;
  rachaDias: number;
  horasSemana: { dia: string; horas: number }[];
  metaSemanal: number;
  asignaturas: { nombre: string; icono: string }[];
  salasVinculadas: { nombre: string; participantes: number; publica: boolean; icono: string }[];
};

const EJEMPLO: Estadisticas = {
  salasCreadas: 3,
  salasPublicas: 2,
  salasPrivadas: 1,
  horasEstudio: 28,
  sesionesCompletadas: 14,
  rachaDias: 5,
  horasSemana: [
    { dia: "Lun", horas: 3 },
    { dia: "Mar", horas: 5 },
    { dia: "Mié", horas: 6.5 },
    { dia: "Jue", horas: 4 },
    { dia: "Vie", horas: 7 },
    { dia: "Sáb", horas: 2 },
    { dia: "Dom", horas: 0.5 },
  ],
  metaSemanal: 25,
  asignaturas: [
    { nombre: "Cálculo Multivariable", icono: "functions" },
    { nombre: "Álgebra Lineal II", icono: "analytics" },
    { nombre: "Métodos Numéricos", icono: "draw" },
  ],
  salasVinculadas: [
    { nombre: "Cálculo III: Integrales Triples", participantes: 4, publica: true, icono: "draw" },
    { nombre: "Taller Álgebra Lineal #4", participantes: 2, publica: false, icono: "groups" },
  ],
};

const VACIO: Estadisticas = {
  salasCreadas: 0,
  salasPublicas: 0,
  salasPrivadas: 0,
  horasEstudio: 0,
  sesionesCompletadas: 0,
  rachaDias: 0,
  horasSemana: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dia) => ({ dia, horas: 0 })),
  metaSemanal: 25,
  asignaturas: [],
  salasVinculadas: [],
};

export const obtenerEstadisticas = (): Estadisticas => (DATOS_DEMO ? EJEMPLO : VACIO);
