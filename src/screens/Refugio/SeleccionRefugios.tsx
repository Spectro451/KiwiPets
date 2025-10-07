import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { getRefugio, refugioByUsuarioId } from "../../services/fetchRefugio";
import { api } from "../../services/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import { Refugio } from "../../types/refugio";

export default function SeleccionarRefugioScreen() {
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const {user} = useAuth();
  const { selectedIds } = route.params as { selectedIds: number[] };

  const [refugios, setRefugios] = useState<any[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [refugioSeleccionado, setRefugioSeleccionado] = useState<any>(null);
  const [resultMessage, setResultMessage] = useState<string>("");

useEffect(() => {
  const fetchRefugios = async () => {
    try {
      if (!user) return;
      const miRefugio = await refugioByUsuarioId();
      const todos = await getRefugio();

      const filtrados = todos.filter(
        (r: Refugio) => r.validado && r.id !== miRefugio?.id
      );
      setRefugios(filtrados);
    } catch (err) {
      console.error("Error al cargar refugios:", err);
    }
  };

  fetchRefugios();
}, [user]);

  const openConfirmModal = (refugio: any) => {
    setRefugioSeleccionado(refugio);
    setConfirmModalVisible(true);
  };

  const handleTransferir = async () => {
    if (!refugioSeleccionado) return;

    try {
      await api.post("/mascota/transferir", {
        mascotasIds: selectedIds,
        refugioDestinoId: refugioSeleccionado.id
      });
      setConfirmModalVisible(false);
      setResultMessage("¡Mascotas transferidas correctamente!");
      setResultModalVisible(true);
    } catch (error: any) {
      setConfirmModalVisible(false);
      setResultMessage(error.response?.data || error.message);
      setResultModalVisible(true);
    }
  };

  const renderRefugio = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.refugioContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.backgroundTertiary }]}
      onPress={() => openConfirmModal(item)}
    >
      <Text style={[styles.refugioNombre, { color: theme.colors.text }]}>{item.nombre}</Text>
      <Text style={[styles.refugioInfo, { color: theme.colors.textSecondary }]}>{item.direccion}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Seleccionar Refugio</Text>
        <TouchableOpacity
          onPress={() => {
            setConfirmModalVisible(false);
            setResultModalVisible(false);
            setRefugioSeleccionado(null);
            navigation.goBack();
          }}
          style={{ padding: 10 }}
        >
          <Text style={{ color: theme.colors.text, fontSize: 20 }}>← Volver</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={refugios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRefugio}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Modal de confirmación */}
      <Modal transparent visible={confirmModalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              ¿Transferir {selectedIds.length} mascota(s) a: {refugioSeleccionado?.nombre}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => {setConfirmModalVisible(false); setRefugioSeleccionado(null);}} style={styles.modalButton}>
                <Text style={{ color: theme.colors.text }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTransferir} style={styles.modalButton}>
                <Text style={{ color: "green" }}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de resultado */}
      <Modal transparent visible={resultModalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>{resultMessage}</Text>
            <View style={{ alignItems: "center", marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  setResultModalVisible(false);
                  navigation.goBack();
                }}
                style={styles.modalButton}
              >
                <Text style={{ color: theme.colors.text }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  refugioContainer: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 12 },
  refugioNombre: { fontWeight: "bold", fontSize: 16 },
  refugioInfo: { fontSize: 14, marginTop: 4 },
  modalBackground: { flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'center', alignItems:'center' },
  modalContainer: { width: 280, padding: 20, borderRadius: 10,  },
  modalText: { fontSize: 16, fontWeight:'bold', textAlign:'center', marginBottom: 15,alignItems:'center' },
  modalButtons: { flexDirection:'row', justifyContent:'space-between' },
  modalButton: { padding:10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },

});
