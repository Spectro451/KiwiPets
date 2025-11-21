import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAdopcionId, updateAdopcion } from "../../services/fetchAdopcion";
import { EstadoAdopcion } from "../../types/enums";

export default function Detalles({ route }: any) {
  const { id } = route.params;
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [adopcion, setAdopcion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [modalRechazo, setModalRechazo] = useState(false);
  const [motivo, setMotivo] = useState("");

  const [modalExito, setModalExito] = useState(false);

  const cargarAdopcion = async () => {
    try {
      setLoading(true);
      const data = await getAdopcionId(id);
      setAdopcion(data);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarAdopcion();
    }, [id])
  );

  const aprobar = async () => {
    const updated = await updateAdopcion(id, {
      data: { estado: EstadoAdopcion.ACEPTADA }
    });

    if (updated) {
      setAdopcion(updated);
      setModalExito(true);
    }
  };

  const rechazar = async () => {
    if (!motivo.trim()) return;

    const updated = await updateAdopcion(id, {
      data: { estado: EstadoAdopcion.RECHAZADA },
      motivo
    });

    if (updated) {
      setModalRechazo(false);
      navigation.goBack();
    }
  };

  if (loading || !adopcion) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </SafeAreaView>
    );
  }

  const a = adopcion;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Botón Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={[styles.screenTitle, { color: theme.colors.text }]}>
          Detalles de la Adopción
        </Text>

        {/* CARD ─ Mascota */}
        <View style={[styles.card, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.backgroundTertiary }]}>
          <Text style={[styles.cardHeader, { color: theme.colors.secondary }]}>
            Mascota
          </Text>

          <InfoRow label="Nombre" value={a.mascota?.nombre} theme={theme} />
          <InfoRow label="Raza" value={a.mascota?.raza || "No especificada"} theme={theme} />
          <InfoRow label="Edad" value={`${a.mascota?.edad} años`} theme={theme} />
          <InfoRow label="Personalidad" value={a.mascota?.personalidad} theme={theme} />
          <InfoRow label="Descripción" value={a.mascota?.descripcion} theme={theme} />
        </View>

        {/* CARD ─ Adoptante */}
        <View style={[styles.card, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.backgroundTertiary }]}>
          <Text style={[styles.cardHeader, { color: theme.colors.secondary }]}>Adoptante</Text>

          <InfoRow label="Nombre" value={a.adoptante?.nombre} theme={theme} />
          <InfoRow label="Teléfono" value={a.adoptante?.telefono} theme={theme} />
          <InfoRow label="Dirección" value={a.adoptante?.direccion} theme={theme} />
          <InfoRow label="Motivo adopción" value={a.adoptante?.motivo_adopcion} theme={theme} />
        </View>

        {/* CARD ─ Proceso */}
        <View style={[styles.card, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.backgroundTertiary }]}>
          <Text style={[styles.cardHeader, { color: theme.colors.secondary }]}>
            Estado del proceso
          </Text>

          <InfoRow label="Estado" value={a.estado} theme={theme} />
          <InfoRow label="Fecha" value={new Date(a.fecha).toLocaleDateString()} theme={theme} />
        </View>

        {/* BOTONES */}
        {a.estado === "En proceso" && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={aprobar}
              style={[styles.actionButton, { backgroundColor: theme.colors.accent }]}
            >
              <Text style={styles.actionText}>Aprobar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalRechazo(true)}
              style={[styles.actionButton, { backgroundColor: "#D9534F" }]}
            >
              <Text style={styles.actionText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* MODAL ─ Rechazo */}
      <Modal visible={modalRechazo} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Motivo del rechazo</Text>

            <TextInput
              style={[
                styles.modalInput,
                {
                  borderColor: theme.colors.backgroundTertiary,
                  color: theme.colors.text
                }
              ]}
              multiline
              value={motivo}
              placeholder="Escriba aquí..."
              placeholderTextColor={theme.colors.textSecondary}
              onChangeText={setMotivo}
            />

            <View style={styles.modalRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#D9534F" }]}
                onPress={rechazar}
              >
                <Text style={styles.modalBtnTxt}>Rechazar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.colors.backgroundTertiary }]}
                onPress={() => setModalRechazo(false)}
              >
                <Text style={[styles.modalBtnTxt, { color: theme.colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL ─ Éxito */}
      <Modal visible={modalExito} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>¡Adopción aceptada!</Text>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#4CAF50" }]}
              onPress={() => {
                setModalExito(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.modalBtnTxt}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* COMPONENTE REUTILIZABLE */
function InfoRow({ label, value, theme }: any) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{label}:</Text>
      <Text style={[styles.infoValue, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    gap: 20
  },

  backRow: {
    width: "100%",
  },

  backIcon: {
    fontSize: 30,
    fontWeight: "bold",
  },

  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 5,
  },

  card: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 18,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  cardHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoLabel: {
    fontSize: 15,
    fontWeight: "600",
  },

  infoValue: {
    fontSize: 15,
    flexShrink: 1,
    textAlign: "right",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },

  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: Platform.OS === "web" ? 420 : 320,
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    gap: 15,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 70,
    textAlignVertical: "top",
  },

  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  modalBtnTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
