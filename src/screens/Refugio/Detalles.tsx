import { View, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Adopcion } from "../../types/adopcion";
import { getAdopcionId, updateAdopcion } from "../../services/fetchAdopcion";
import { EstadoAdopcion } from "../../types/enums";

type RouteParams = {
  DetalleAdopcion: { id: number };
};

export default function DetalleAdopcion() {
  const route = useRoute<RouteProp<RouteParams, "DetalleAdopcion">>();
  const { id } = route.params;
  const [adopcion, setAdopcion] = useState<Adopcion | null>(null);
  const [modal, setModal] = useState(false);
  const isWeb = Platform.OS === "web";
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [modalExito, setModalExito] = useState(false);

  useEffect(()=>{
    const fetchAdopcion = async()=>{
      const data = await getAdopcionId(id);
      setAdopcion(data);
    };
    fetchAdopcion();
  },[id]);

  if(!adopcion){
    return(
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const handleAceptar = async () => {
    const updated = await updateAdopcion(adopcion.id, { 
      data: { estado: EstadoAdopcion.ACEPTADA } 
    });
    if (updated) {
      setAdopcion(updated);
      setModalExito(true);
    }
  };

  const handleRechazar = async ()=>{
    setModal(true)
  };

  const AdoptanteInfo = ({ adopcion }: { adopcion: Adopcion }) => (
    <View style={styles.column}>
      <Text style={styles.title}>Adoptante</Text>
      <Text><Text style={{ fontWeight: "bold" }}>RUT:</Text> {adopcion.adoptante.rut}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Nombre:</Text> {adopcion.adoptante.nombre}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Edad:</Text> {adopcion.adoptante.edad}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Teléfono:</Text> {adopcion.adoptante.telefono}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Dirección:</Text> {adopcion.adoptante.direccion}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Experiencia con mascotas:</Text> {adopcion.adoptante.experiencia_mascotas ? "Sí" : "No"}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Cantidad de mascotas:</Text> {adopcion.adoptante.cantidad_mascotas}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Tipo de vivienda:</Text> {adopcion.adoptante.tipo_vivienda}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Motivo adopción:</Text> {adopcion.adoptante.motivo_adopcion}</Text>
    </View>
  );

  const MascotaInfo = ({ adopcion }: { adopcion: Adopcion }) => (
    <View style={styles.column}>
      <Text style={styles.title}>Mascota</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Nombre:</Text> {adopcion.mascota.nombre}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Especie:</Text> {adopcion.mascota.especie}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Raza:</Text> {adopcion.mascota.raza}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Edad:</Text> {adopcion.mascota.edad} años</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Género:</Text> {adopcion.mascota.genero}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Tamaño:</Text> {adopcion.mascota.tamaño}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Vacunado:</Text> {adopcion.mascota.vacunado ? "Sí" : "No"}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Esterilizado:</Text> {adopcion.mascota.esterilizado ? "Sí" : "No"}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Discapacidad:</Text> {adopcion.mascota.discapacidad ? "Sí" : "No"}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Requisitos adopción:</Text> {adopcion.mascota.requisito_adopcion}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Personalidad:</Text> {adopcion.mascota.personalidad}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Descripción:</Text> {adopcion.mascota.descripcion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AdoptanteInfo adopcion={adopcion}/>
      <MascotaInfo adopcion={adopcion}/>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.aceptar]} onPress={handleAceptar}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rechazar]} onPress={handleRechazar}>
          <Text style={styles.buttonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text>Aquí</Text>
            <TouchableOpacity style={styles.button} onPress={() => setModal(false)}>
              <Text style={styles.buttonText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={modalExito} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 20, textAlign: "center" }}>¡Adopción realizada!</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#4CAF50" }]}
              onPress={() => {
                setModalExito(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "center",
    gap: 50,
    padding: 10,
    flexWrap: "wrap",
  },
  column: {
    minWidth: 250,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
  },
  aceptar: {
    backgroundColor: "#4CAF50",
  },
  rechazar: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
});
