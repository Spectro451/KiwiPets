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
const isWeb = Platform.OS === "web";
const CARD_WIDTH = isWeb ? width * 0.95 : Math.min(width * 0.95, 480);

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
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: CARD_WIDTH,
    alignSelf: "center",
  },

  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
    resizeMode: "cover",
  },

  info: { flex: 1 },

  nombre: {
    fontSize: 16,
    fontWeight: "bold",
  },

  sub: {
    fontSize: 12,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
  },

  botonEliminar: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
    width: CARD_WIDTH,
    alignSelf: "center",
  },

  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
