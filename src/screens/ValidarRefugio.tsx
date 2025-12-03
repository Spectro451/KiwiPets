import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Switch,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import { getRefugio, updateRefugio } from "../services/fetchRefugio";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const MAX_CARD_WIDTH = 480;
const CARD_WIDTH =
  width <= 480
    ? width * 0.92
    : width <= 840
    ? Math.min(width * 0.8, MAX_CARD_WIDTH)
    : MAX_CARD_WIDTH;

interface Props {
  user: { id: number; tipo: string; admin: boolean };
}

export default function ValidarRefugioScreen({ user }: Props) {
  const { theme } = useTheme();
  const [refugios, setRefugios] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refugioSeleccionado, setRefugioSeleccionado] = useState<any>(null);
  const [validadoTemp, setValidadoTemp] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchRefugios = async () => {
        setLoading(true);
        try {
          const data = await getRefugio();
          setRefugios(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchRefugios();
    }, [])
  );

  const openModal = (refugio: any) => {
    setRefugioSeleccionado(refugio);
    setValidadoTemp(refugio.validado);
    setModalVisible(true);
  };

  const handleGuardar = async () => {
    if (!refugioSeleccionado) return;
    try {
      const updated = await updateRefugio(refugioSeleccionado.id, {
        validado: validadoTemp,
      });

      setRefugios((prev) =>
        prev.map((r) =>
          r.id === updated.id ? { ...r, validado: updated.validado } : r
        )
      );

      setModalVisible(false);
      setRefugioSeleccionado(null);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.backgroundSecondary,
          borderColor: theme.colors.backgroundTertiary,
        },
      ]}
      onPress={() => user.admin && openModal(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.infoSection}>
          <Text
            style={[styles.refugioNombre, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {item.nombre}
          </Text>
          <Text
            style={[
              styles.refugioDireccion,
              { color: theme.colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {item.direccion}
          </Text>
          <Text
            style={[
              styles.refugioTelefono,
              { color: theme.colors.textSecondary },
            ]}
          >
            Tel: {item.telefono}
          </Text>
        </View>

        <View
          style={[
            styles.validadoBadge,
            {
              backgroundColor: item.validado
                ? theme.colors.accent
                : theme.colors.error,
            },
          ]}
        >
          <Text style={styles.validadoText}>
            {item.validado ? "Validado" : "Pendiente"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <Text style={[styles.titulo, { color: theme.colors.text }]}>
        Validar Refugios
      </Text>

      <FlatList
        data={refugios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={() => {
          const fetchRefugios = async () => {
            setLoading(true);
            try {
              const data = await getRefugio();
              setRefugios(data);
            } catch (error) {
              console.error(error);
            } finally {
              setLoading(false);
            }
          };
          fetchRefugios();
        }}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              {loading ? "Cargando..." : "No hay refugios registrados"}
            </Text>
          </View>
        }
      />

      {/* Modal de validación */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Validar refugio
            </Text>
            <Text
              style={[
                styles.modalRefugioNombre,
                { color: theme.colors.textSecondary },
              ]}
            >
              {refugioSeleccionado?.nombre}
            </Text>

            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                Estado de validación
              </Text>
              <Switch
                value={validadoTemp}
                onValueChange={setValidadoTemp}
                trackColor={{ false: "#ccc", true: theme.colors.accent }}
                thumbColor="#fff"
              />
            </View>

            <Text
              style={[
                styles.statusText,
                {
                  color: validadoTemp
                    ? theme.colors.accent
                    : theme.colors.error,
                },
              ]}
            >
              {validadoTemp ? "Validado ✓" : "No validado ✗"}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setRefugioSeleccionado(null);
                }}
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.colors.backgroundTertiary },
                ]}
              >
                <Text style={{ color: theme.colors.text }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGuardar}
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.colors.accent },
                ]}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 12,
  },

  listContainer: {
    padding: 16,
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    marginVertical: 10,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  infoSection: {
    flex: 1,
    marginRight: 12,
  },

  refugioNombre: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },

  refugioDireccion: {
    fontSize: 14,
    marginBottom: 2,
  },

  refugioTelefono: {
    fontSize: 13,
  },

  validadoBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },

  validadoText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },

  modalRefugioNombre: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 8,
  },

  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
  },

  statusText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 24,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
