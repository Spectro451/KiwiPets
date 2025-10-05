import { useCallback, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { getMascotas } from "../../services/fetchMascotas";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const ITEM_WIDTH = Dimensions.get("window").width / 3 - 15; // 3 columnas con margen

export default function MisMascotasScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchMascotas = async () => {
        try {
          const data = await getMascotas();
          setMascotas(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMascotas();
    }, [])
  );

  const openModal = (mascota: any) => {
    setSelectedMascota(mascota);
    setModalVisible(true);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Mis Mascotas</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{padding:10}}>
            <Text style={{ color: theme.colors.text, fontSize:20 }}>← Volver</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {mascotas.map((item) => (
            <TouchableOpacity
              key={item.id_mascota}
              style={[styles.itemContainer, {backgroundColor:theme.colors.backgroundSecondary, borderColor:theme.colors.backgroundTertiary}]}
              onPress={() => openModal(item)}
            >
              <Image
                source={item.foto ? { uri: item.foto } : undefined}
                style={styles.image}
              />
              <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
                {item.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
       <Modal visible={modalVisible} transparent animationType="slide">
        <View style={[styles.modalBackground]}>
          <View style={[styles.modalContent, {backgroundColor:theme.colors.background, borderColor:theme.colors.backgroundTertiary}]}>
            <ScrollView style={{ width: '100%' }}>
              {selectedMascota && (
                <>
                  <Text style={[styles.modalTitle, {color: theme.colors.text}]}>{selectedMascota.nombre}</Text>
                  <Image 
                    source={selectedMascota.foto ? { uri: selectedMascota.foto } : undefined} 
                    style={styles.modalImage} 
                  />
                  <Text style={{color:theme.colors.text}}>Especie: {selectedMascota.especie}</Text>
                  <Text style={{color:theme.colors.text}}>Raza: {selectedMascota.raza}</Text>
                  <Text style={{color:theme.colors.text}}>Edad: {selectedMascota.edad} años</Text>
                  <Text style={{color:theme.colors.text}}>Género: {selectedMascota.genero}</Text>
                  <Text style={{color:theme.colors.text}}>Tamaño: {selectedMascota.tamaño}</Text>
                  <Text style={{color:theme.colors.text}}>Vacunado: {selectedMascota.vacunado ? "Sí" : "No"}</Text>
                  <Text style={{color:theme.colors.text}}>Esterilizado: {selectedMascota.esterilizado ? "Sí" : "No"}</Text>
                  <Text style={{color:theme.colors.text}}>Discapacidad: {selectedMascota.discapacidad ? "Sí" : "No"}</Text>
                  <Text style={{color:theme.colors.text}}>Requisitos adopción: {selectedMascota.requisito_adopcion}</Text>
                  <Text style={{color:theme.colors.text}}>Personalidad: {selectedMascota.personalidad}</Text>
                  <Text style={{color:theme.colors.text}}>Descripción: {selectedMascota.descripcion}</Text>
                </>
              )}
            </ScrollView>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: theme.colors.backgroundTertiary, marginTop: 10}]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{color: theme.colors.text, fontWeight: "bold"}}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",marginBottom: 20 },
  itemContainer: { width: ITEM_WIDTH, marginBottom: 10, alignItems: "center", padding:5, borderWidth:2, borderRadius:10 },
  image: { width: '100%', height: ITEM_WIDTH, borderRadius: 10, marginBottom: 5, resizeMode:"stretch" },
  name: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',},
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: 350, padding: 20, borderRadius: 8, borderWidth: 2, alignItems: "center" },
  modalTitle: { fontWeight: "bold", fontSize: 18, textAlign: "center", marginBottom: 10 },
  modalImage: { width: '100%', height: 250, borderRadius: 8, marginBottom: 10 },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6, alignItems: "center" }
});
