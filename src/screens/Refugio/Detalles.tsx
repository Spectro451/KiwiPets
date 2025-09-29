import { View, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, Modal, Alert, TextInput, ActivityIndicator } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Adopcion } from "../../types/adopcion";
import { getAdopcionId, updateAdopcion } from "../../services/fetchAdopcion";
import { EstadoAdopcion } from "../../types/enums";
import { useTheme } from "../../theme/ThemeContext";

type RouteParams = {
  DetalleAdopcion: { id: number };
};
const isWeb = Platform.OS === "web";
const { width } = Dimensions.get("window");

export default function DetalleAdopcion() {
  const route = useRoute<RouteProp<RouteParams, "DetalleAdopcion">>();
  const { id } = route.params;
  const [adopcion, setAdopcion] = useState<Adopcion | null>(null);
  const [modalRechazo, setModalRechazo] = useState(false);
  const [motivo, setMotivo] = useState("");
  const navigation = useNavigation();
  const [modalExito, setModalExito] = useState(false);
  const {theme} = useTheme();

  useEffect(()=>{
    const fetchAdopcion = async()=>{
      const data = await getAdopcionId(id);
      setAdopcion(data);
    };
    fetchAdopcion();
  },[id]);

  if (!adopcion) {
    return (
      <View style={{ 
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
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
    if(!motivo.trim()){
      Alert.alert("Debe ingresar un motivo");
      return;
    }
    const updated = await updateAdopcion(adopcion.id, {
      data: {estado:EstadoAdopcion.RECHAZADA},
      motivo: motivo
    });
    if(updated){
      setAdopcion(updated);
      setModalRechazo(false);
      setMotivo("");
      navigation.goBack();
    }
  };

  const AdoptanteInfo = ({ adopcion }: { adopcion: Adopcion }) => (
    <View style={[styles.column, {backgroundColor:theme.colors.backgroundSecondary, borderColor:theme.colors.backgroundTertiary}]}>
      <Text style={[styles.title, {color:theme.colors.text}]}>Adoptante</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>RUT:</Text> {adopcion.adoptante.rut}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Nombre:</Text> {adopcion.adoptante.nombre}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Edad:</Text> {adopcion.adoptante.edad} años</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Teléfono:</Text> {adopcion.adoptante.telefono}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Dirección:</Text> {adopcion.adoptante.direccion}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Experiencia con mascotas:</Text> {adopcion.adoptante.experiencia_mascotas ? "Sí" : "No"}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Cantidad de mascotas:</Text> {adopcion.adoptante.cantidad_mascotas}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Tipo de vivienda:</Text> {adopcion.adoptante.tipo_vivienda}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Motivo adopción:</Text> {adopcion.adoptante.motivo_adopcion}</Text>
    </View>
  );

  const MascotaInfo = ({ adopcion }: { adopcion: Adopcion }) => (
    <View style={[styles.column, {backgroundColor:theme.colors.backgroundSecondary, borderColor:theme.colors.backgroundTertiary}]}>
      <Text style={[styles.title, {color:theme.colors.text}]}>Mascota</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Nombre:</Text> {adopcion.mascota.nombre}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Especie:</Text> {adopcion.mascota.especie}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Raza:</Text> {adopcion.mascota.raza}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Edad:</Text> {adopcion.mascota.edad} años</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Género:</Text> {adopcion.mascota.genero}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Tamaño:</Text> {adopcion.mascota.tamaño}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Vacunado:</Text> {adopcion.mascota.vacunado ? "Sí" : "No"}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Esterilizado:</Text> {adopcion.mascota.esterilizado ? "Sí" : "No"}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Discapacidad:</Text> {adopcion.mascota.discapacidad ? "Sí" : "No"}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Requisitos adopción:</Text> {adopcion.mascota.requisito_adopcion}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Personalidad:</Text> {adopcion.mascota.personalidad}</Text>
      <Text style={{color:theme.colors.text}}><Text style={{ fontWeight: "bold", color:theme.colors.textSecondary }}>Descripción:</Text> {adopcion.mascota.descripcion}</Text>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor:theme.colors.background}]}>
      <TouchableOpacity 
        style={styles.backButtonContainer} 
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: 24, color: theme.colors.text, fontWeight: "bold" }}>
          ←
        </Text>
      </TouchableOpacity>

      <AdoptanteInfo adopcion={adopcion}/>
      <MascotaInfo adopcion={adopcion}/>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.aceptar]} onPress={handleAceptar}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rechazar]} onPress={()=>setModalRechazo(true)}>
          <Text style={styles.buttonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalRechazo} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, {backgroundColor:theme.colors.background, borderWidth:2, borderColor:theme.colors.backgroundTertiary}]}>
            <Text style={{color:theme.colors.text, marginBottom:10, fontWeight:"bold", fontSize:16}}>
              Ingrese el motivo del rechazo
            </Text>
            <TextInput
              style={[styles.input,{
                borderColor:theme.colors.backgroundTertiary,
                color:theme.colors.text,
              }]}
              placeholder="Escriba aquí..."
              placeholderTextColor={theme.colors.textSecondary}
              value={motivo}
              onChangeText={setMotivo}
              multiline
            />
            <View style={{flexDirection:"row", gap:10}}>
              <TouchableOpacity
                style={[styles.button, styles.rechazar]}
                onPress={handleRechazar}
              >
                <Text style={styles.buttonText}>Rechazar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: theme.colors.backgroundTertiary}]}
                onPress={() => setModalRechazo(false)}
              >
                <Text style={{color:theme.colors.text, fontWeight:"bold"}}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={modalExito} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, {backgroundColor:theme.colors.background, borderWidth:2, borderColor:theme.colors.backgroundTertiary}]}>
            <Text style={{ marginBottom: 20, textAlign: "center", color:theme.colors.text }}>¡Adopción realizada!</Text>
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
    flexDirection: isWeb ? "row" : "column",
    justifyContent: isWeb ? "center": "space-around",
    gap: 25,
    padding: 18,
    flexWrap: "wrap",
    alignContent:"center"
  },
  column: {
    minWidth: 350,
    padding: 12,
    borderWidth: 3,
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20,
    alignItems: "center",
    width: "100%",
    marginBottom:10
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
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
  },
  modalContent: {
    width:isWeb ? 500 : 350,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  input: {
    borderWidth:1,
    borderRadius:6,
    padding:8,
    width:"100%",
    minHeight:70,
    textAlignVertical:"top",
    marginBottom:15
  },
  backButtonContainer: {
    width: "100%", 
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
