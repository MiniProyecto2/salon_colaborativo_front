import PantallaEnConstruccion from "../components/PantallaEnConstruccion";

export default function MisSalasPage() {
  return (
    <PantallaEnConstruccion
      titulo="Mis salas propias"
      descripcion="Aquí podrás administrar todas las salas que creaste."
      volverA={{ to: "/dashboard", texto: "Volver al Panel" }}
    />
  );
}
