type Props = { datos: { dia: string; horas: number }[]; hoy: number };

/** Barras de horas de estudio por día. Es una imagen con descripción de texto para lectores de pantalla. */
export default function GraficoSemanal({ datos, hoy }: Props) {
  const maximo = Math.max(8, ...datos.map((d) => d.horas));
  const mayor = Math.max(...datos.map((d) => d.horas));
  const alto = 80;
  const descripcion = `Horas de estudio por día: ${datos.map((d) => `${d.dia} ${d.horas} h`).join(", ")}.`;

  return (
    <svg role="img" aria-label={descripcion} viewBox="0 0 320 120" className="w-full h-auto text-outline-variant">
      <line x1="0" x2="320" y1="20" y2="20" stroke="currentColor" strokeDasharray="2,2" />
      <line x1="0" x2="320" y1="60" y2="60" stroke="currentColor" strokeDasharray="2,2" />
      <line x1="0" x2="320" y1="100" y2="100" stroke="currentColor" />
      {datos.map((d, i) => {
        const h = Math.max(d.horas > 0 ? 4 : 0, (d.horas / maximo) * alto);
        const x = 20 + i * 45;
        const color =
          d.horas > 0 && d.horas === mayor ? "var(--color-secondary)" : i === hoy ? "var(--color-primary-container)" : "var(--color-surface-container-high)";
        return (
          <g key={d.dia}>
            <rect x={x} y={100 - h} width="22" height={h} rx="4" fill={color} />
            <text x={x + 11} y="114" textAnchor="middle" fontSize="10" fill="var(--color-on-surface-variant)" fontFamily="Inter, sans-serif">
              {d.dia}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
