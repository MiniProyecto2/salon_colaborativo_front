import PantallaEnConstruccion from "../components/PantallaEnConstruccion";

export default function PizarraPage() {
  return (
    <PantallaEnConstruccion
      titulo="Pizarra compartida"
      descripcion="Aquí estará la pizarra colaborativa para dibujar y resolver ejercicios en grupo."
      volverA={{ to: "/dashboard", texto: "Volver al Panel" }}
    />
  );
}
