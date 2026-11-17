import { useParams } from "react-router-dom";
import PantallaEnConstruccion from "../components/PantallaEnConstruccion";

export default function SalaPage() {
  const { id } = useParams();
  return <PantallaEnConstruccion titulo={`Sala ${id ?? ""}`.trim()} sprint={3} descripcion="Aquí estarán el chat, la cuadrícula de participantes y los controles de audio, video y pantalla." />;
}
