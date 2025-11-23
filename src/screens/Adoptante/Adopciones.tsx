import { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import Checkbox from "expo-checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "../../theme/ThemeContext";
import { Adopcion } from "../../types/adopcion";
import { getAdopcion, deleteAdopcion } from "../../services/fetchAdopcion";

const { width } = Dimensions.get("window");
const MAX_CARD_WIDTH = 480;
const CARD_WIDTH =
  width <= 480
    ? width * 0.92
    : width <= 840
    ? Math.min(width * 0.8, MAX_CARD_WIDTH)
    : MAX_CARD_WIDTH;

export default function AdopcionesScreen() {
  const { theme } = useTheme();

  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  // --------------------------------------------
  // Cargar adopciones
  // --------------------------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAdopcion();
      setAdopciones(data);
    } catch (e) {
      console.error("Error cargando adopciones:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // --------------------------------------------
  // Seleccionar / deseleccionar
  // --------------------------------------------
  const toggleSeleccion = (id: number) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // --------------------------------------------
  // Eliminar seleccionadas
  // --------------------------------------------
  const eliminarSeleccionadas = async () => {
    if (seleccionadas.length === 0) {
      Alert.alert("Selecciona al menos una solicitud.");
      return;
    }

    if (bloqueado) return;
    setBloqueado(true);

    try {
      await Promise.all(
        seleccionadas.map((id) => {
          console.log("Eliminando adopción ID:", id);
          return deleteAdopcion(id);
        })
      );

      setAdopciones((prev) =>
        prev.filter((a) => !seleccionadas.includes(a.id))
      );
      setSeleccionadas([]);
    } catch (e) {
      console.error("Error eliminando:", e);
    } finally {
      setTimeout(() => setBloqueado(false), 1200);
    }
  };

  // --------------------------------------------
  // Render item
  // --------------------------------------------
  const renderItem = ({ item }: { item: Adopcion }) => (
    <TouchableOpacity
      onPress={() => toggleSeleccion(item.id)}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.backgroundSecondary,
          borderColor: theme.colors.backgroundTertiary,
        },
      ]}
    >
      <Checkbox
        value={seleccionadas.includes(item.id)}
        onValueChange={() => toggleSeleccion(item.id)}
        color={
          seleccionadas.includes(item.id) ? theme.colors.accent : undefined
        }
      />

      <Image
        source={{ uri: item.mascota.foto }}
        style={styles.foto}
      />

      <View style={styles.info}>
        <Text style={[styles.nombre, { color: theme.colors.text }]}>
          {item.mascota.nombre}
        </Text>

        <Text style={[styles.sub, { color: theme.colors.secondary }]}>
          {new Date(item.fecha_solicitud).toLocaleDateString()}
        </Text>

        <Text style={[styles.sub, { color: theme.colors.text }]}>
          {item.estado}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // --------------------------------------------
  // Vista
  // --------------------------------------------
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <Text style={[styles.titulo, { color: theme.colors.text }]}>
        Mis solicitudes
      </Text>

      <FlatList
        data={adopciones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchData}
      />

      <TouchableOpacity
        style={[
          styles.botonEliminar,
          {
            backgroundColor:
              seleccionadas.length > 0
                ? theme.colors.error
                : theme.colors.errorDeshabilitado,
            opacity: seleccionadas.length > 0 ? 1 : 0.6,
          },
        ]}
        onPress={eliminarSeleccionadas}
        disabled={seleccionadas.length === 0 || bloqueado}
      >
        <Text style={styles.botonTexto}>Eliminar seleccionadas</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --------------------------------------------
// Estilos
// --------------------------------------------
const styles = StyleSheet.create({
  titulo: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 14,
    marginVertical: 10,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    gap: 14,
  },

  foto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: "cover",
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  nombre: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },

  sub: {
    fontSize: 13,
    marginBottom: 1,
  },

  botonEliminar: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
    marginBottom: 20,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  botonTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});