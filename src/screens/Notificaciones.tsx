import { useCallback, useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import { useTheme } from "../theme/ThemeContext";
import {
  Alert,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Notificaciones } from "../types/notificaciones";
import {
  deleteNotificaciones,
  getNotificaciones,
  marcarLeida,
} from "../services/fetchNotificaciones";
import { useAuth } from "../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const isSmall = width <= 480;     // móviles pequeños
const isTablet = width > 480 && width <= 1024;  // tablets
const isWeb = Platform.OS === "web";

// El card debe adaptarse
const CARD_WIDTH =
  width < 500
    ? width * 0.92
    : width < 900
    ? width * 0.85
    : 600;                            // móvil: 92%


export default function NotificacionesScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [notificaciones, setNotificaciones] = useState<Notificaciones[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [botonBloqueado, setBotonBloqueado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState<string | null>(
    null
  );

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const data = await getNotificaciones();
      setNotificaciones(data);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotificaciones();
    }, [])
  );

  const toggleSelection = (id: number) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSeleccionarTodo = () => {
    setSeleccionadas(
      seleccionadas.length === notificaciones.length
        ? []
        : notificaciones.map((n) => n.id)
    );
  };

  const eliminarSeleccionadas = async () => {
    if (seleccionadas.length === 0) {
      Alert.alert("Debe seleccionar al menos una");
      return;
    }
    if (botonBloqueado) return;

    setBotonBloqueado(true);

    const seleccionadasLeidas = notificaciones.filter(
      (n) => seleccionadas.includes(n.id) && n.leido
    );

    const noLeidas = notificaciones.filter(
      (n) => seleccionadas.includes(n.id) && !n.leido
    );

    if (noLeidas.length > 0) {
      setMensajeSeleccionado("Debe marcar como leída antes de borrar.");
      setModalVisible(true);
    }

    if (seleccionadasLeidas.length === 0) {
      setBotonBloqueado(false);
      return;
    }

    try {
      await Promise.all(
        seleccionadasLeidas.map((n) => deleteNotificaciones(n.id))
      );

      const idsEliminadas = seleccionadasLeidas.map((n) => n.id);
      setNotificaciones((prev) =>
        prev.filter((n) => !idsEliminadas.includes(n.id))
      );
      setSeleccionadas((prev) =>
        prev.filter((id) => !idsEliminadas.includes(id))
      );
    } finally {
      setBotonBloqueado(false);
    }
  };

  const handlePress = async (item: Notificaciones) => {
    if (!item.leido) {
      await marcarLeida(item.id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, leido: true } : n))
      );
    }

    if (user?.tipo === "Refugio" && item.adopcionId) {
      navigation.push("DetalleAdopcion", { id: item.adopcionId });
    } else {
      setMensajeSeleccionado(item.mensaje);
      setModalVisible(true);
    }
  };

  const renderItem = ({ item }: { item: Notificaciones }) => (
    <View
      style={[
        styles.itemContainer,
        {
          borderColor: theme.colors.backgroundTertiary,
          backgroundColor: theme.colors.backgroundSecondary,
        },
      ]}
    >
      <Checkbox
        value={seleccionadas.includes(item.id)}
        onValueChange={() => toggleSelection(item.id)}
        color={
          seleccionadas.includes(item.id) ? theme.colors.accent : undefined
        }
        style={{ marginRight: 10 }}
      />

      <TouchableOpacity style={{ flex: 1 }} onPress={() => handlePress(item)}>
        <Text
          style={[
            styles.nombre,
            { color: item.leido ? theme.colors.secondary : theme.colors.text },
          ]}
          numberOfLines={1}
        >
          {item.mensaje}
        </Text>
        <Text style={[styles.fecha, { color: theme.colors.secondary }]}>
          {new Date(item.fecha).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View style={styles.wrapper}>
  <Text style={[styles.titulo, { color: theme.colors.text }]}>
    Mis Notificaciones
  </Text>

  {/* Botón seleccionar todo */}
  <TouchableOpacity
    style={[
      styles.botonEliminar,
      {
        backgroundColor:
          notificaciones.length > 0
            ? theme.colors.accent
            : theme.colors.errorDeshabilitado,
        opacity: notificaciones.length > 0 ? 1 : 0.6,
        width: CARD_WIDTH,
      },
    ]}
    onPress={toggleSeleccionarTodo}
    disabled={notificaciones.length === 0}
  >
    <Text style={styles.botonTexto}>
      {seleccionadas.length === notificaciones.length
        ? "Deseleccionar todo"
        : "Seleccionar todo"}
    </Text>
  </TouchableOpacity>

  {/* Lista */}
  <FlatList
    data={notificaciones}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderItem}
    refreshing={loading}
    onRefresh={fetchNotificaciones}
    contentContainerStyle={{ paddingBottom: 40 }}
    showsVerticalScrollIndicator={false}
  />

  {/* Botón eliminar */}
  <TouchableOpacity
    style={[
      styles.botonEliminar,
      {
        backgroundColor:
          seleccionadas.length > 0
            ? theme.colors.error
            : theme.colors.errorDeshabilitado,
        opacity: seleccionadas.length > 0 ? 1 : 0.6,
        width: CARD_WIDTH,
      },
    ]}
    onPress={eliminarSeleccionadas}
    disabled={seleccionadas.length === 0 || botonBloqueado}
  >
    <Text style={styles.botonTexto}>Eliminar seleccionadas</Text>
  </TouchableOpacity>
</View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.backgroundSecondary },
            ]}
          >
            <Text style={[styles.modalTexto, { color: theme.colors.text }]}>
              {mensajeSeleccionado}
            </Text>
            <TouchableOpacity
              style={[styles.botonCerrar, { backgroundColor: theme.colors.accent }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.botonTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );


}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  nombre: { fontSize: 16, fontWeight: "bold" },
  fecha: { fontSize: 12 },
  botonEliminar: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 15,
  },
  botonTexto: { color: "#fff", fontWeight: "bold" },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    maxWidth: "90%",
  },
  modalTexto: { fontSize: 16, marginBottom: 20 },
  botonCerrar: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
wrapper: {
  flex: 1,
  width: "100%",
  paddingHorizontal: isWeb ? 0 : 20,  
  paddingTop: 20,
  alignItems: "center",      // centra SOLO contenido interno
},
});
