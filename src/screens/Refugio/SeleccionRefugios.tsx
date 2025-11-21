import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { getRefugio, refugioByUsuarioId } from "../../services/fetchRefugio";
import { api } from "../../services/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import { Refugio } from "../../types/refugio";

export default function SeleccionRefugios() {
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();

  const { selectedIds } = route.params as { selectedIds: number[] };

  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [refugioSeleccionado, setRefugioSeleccionado] =
    useState<Refugio | null>(null);

  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    const loadRefugios = async () => {
      setLoading(true);
      try {
        if (!user) return;

        const miRefugio = await refugioByUsuarioId();
        const list = await getRefugio();

        const filtrados = list.filter(
          (r: Refugio) => r.validado === true && r.id !== miRefugio?.id
        );

        setRefugios(filtrados);
      } catch (err) {
        console.error("Error al cargar refugios:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRefugios();
  }, [user]);

  const openConfirmModal = (r: Refugio) => {
    setRefugioSeleccionado(r);
    setConfirmModalVisible(true);
  };

  const handleTransferir = async () => {
    if (!refugioSeleccionado) return;

    try {
      await api.post("/mascota/transferir", {
        mascotasIds: selectedIds,
        refugioDestinoId: refugioSeleccionado.id,
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

  const renderRefugio = ({ item }: { item: Refugio }) => (
    <TouchableOpacity
      style={[
        styles.refugioCard,
        {
          backgroundColor: theme.colors.backgroundSecondary,
          borderColor: theme.colors.backgroundTertiary,
        },
      ]}
      onPress={() => openConfirmModal(item)}
    >
      <Text style={[styles.refugioNombre, { color: theme.colors.text }]}>
        {item.nombre}
      </Text>
      <Text
        style={[styles.refugioInfo, { color: theme.colors.textSecondary }]}
        numberOfLines={1}
      >
        {item.direccion}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Seleccionar Refugio
        </Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
          <Text style={{ color: theme.colors.text, fontSize: 20 }}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.secondary} />
        </View>
      ) : refugios.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: theme.colors.text, fontSize: 16, textAlign: "center" }}>
            No hay refugios disponibles para transferir.
          </Text>
        </View>
      ) : (
        <FlatList
          data={refugios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRefugio}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Confirmación */}
      <Modal transparent visible={confirmModalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme.colors.background, borderColor: theme.colors.backgroundTertiary },
            ]}
          >
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              ¿Transferir {selectedIds.length} mascota(s) a {refugioSeleccionado?.nombre}?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setConfirmModalVisible(false);
                  setRefugioSeleccionado(null);
                }}
                style={styles.modalButton}
              >
                <Text style={{ color: theme.colors.text }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleTransferir} style={styles.modalButton}>
                <Text style={{ color: "green", fontWeight: "bold" }}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Resultado */}
      <Modal transparent visible={resultModalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme.colors.background, borderColor: theme.colors.backgroundTertiary },
            ]}
          >
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              {resultMessage}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setResultModalVisible(false);
                navigation.goBack();
              }}
              style={[styles.modalButton, { marginTop: 10 }]}
            >
              <Text style={{ color: theme.colors.text }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  refugioCard: {
    padding: 14,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 12,
  },

  refugioNombre: {
    fontSize: 16,
    fontWeight: "bold",
  },

  refugioInfo: {
    marginTop: 4,
    fontSize: 14,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: 300,
    padding: 22,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },

  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  modalButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
