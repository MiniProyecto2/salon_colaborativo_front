import PantallaEnConstruccion from "../components/PantallaEnConstruccion";

export default function RecursosPage() {
  return (
    <PantallaEnConstruccion
      titulo="Recursos"
      descripcion="Aquí encontrarás guías y materiales compartidos en tus salas."
      volverA={{ to: "/dashboard", texto: "Volver al Panel" }}
    />
  );
}
