import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

import { getFavorito, deleteFavorito } from "../../services/fetchFavoritos";
import PetSwipe from "../../components/petSwipe";
import SkeletonCard from "../../components/skeletonCard";

export default function FavoritosScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const MAX_CARD_WIDTH = 250;   // tamaño fijo ideal de las cards de Favoritos

  const CARD_WIDTH =
    width <= 480
     ? width * 0.92
     : width <= 840
     ? Math.min(width * 0.45, MAX_CARD_WIDTH)
     : MAX_CARD_WIDTH;

  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMascota, setModalMascota] = useState<any>(null);

  const openModal = (mascota: any) => {
    setModalMascota(mascota);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalMascota(null);
    setModalVisible(false);
  };

  const loadFavoritos = async () => {
    try {
      setLoading(true);
      const data = await getFavorito();
      setFavoritos(data);
    } catch (e) {
      console.error("Error cargando favoritos:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoritos();
    }, [])
  );

  const handleAdoptar = (id: number) => {
    closeModal();
    navigation.navigate("FormularioAdoptante", { id_mascota: id });
  };

  const handleEliminarFavorito = async (id: number) => {
    try {
      closeModal();
      await deleteFavorito(id);
      await loadFavoritos();
    } catch (e) {
      console.error("Error al eliminar favorito:", e);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "bottom"]}
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Favoritos
          </Text>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 20, color: theme.colors.text }}>←</Text>
          </TouchableOpacity>
        </View>

        {/* LOADING */}
        {loading && (
          <View style={{ marginTop: 20 }}>
            <SkeletonCard width={CARD_WIDTH} />
            <SkeletonCard width={CARD_WIDTH} />
          </View>
        )}

        {/* VACÍO */}
        {!loading && favoritos.length === 0 && (
          <Text
            style={{
              textAlign: "center",
              marginTop: 40,
              color: theme.colors.textSecondary,
              fontSize: 16,
            }}
          >
            No tienes mascotas favoritas.
          </Text>
        )}

        {/* GRID */}
        <View
          style={[
            styles.grid,
            {
              gap: width <= 480 ? 12 : 16,
              maxWidth: 900,
              alignSelf: "center",
            },
          ]}
        >
          {!loading &&
            favoritos.map((m) => (
              <TouchableOpacity
                key={m.id_mascota}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderColor: theme.colors.backgroundTertiary,
                    width: CARD_WIDTH,
                  },
                ]}
                onPress={() => openModal(m)}
              >
                {/* Imagen */}
                <View style={{ width: "100%", aspectRatio: 1 }}>
                  <Image
                    source={
                      m.foto
                        ? { uri: m.foto }
                        : { uri: "https://via.placeholder.com/400x400?text=Sin+Foto" }
                    }
                    style={styles.img}
                  />
                </View>

                <Text
                  style={[
                    styles.name,
                    { color: theme.colors.text, marginTop: 8 },
                  ]}
                  numberOfLines={1}
                >
                  {m.nombre}
                </Text>

                <PetSwipe
                  mascota={m}
                  onToggleFavorito={() => handleEliminarFavorito(m.id_mascota)}
                />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modal,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.backgroundTertiary,
              },
            ]}
          >
            <Text
              style={{
                color: theme.colors.text,
                marginBottom: 16,
                fontSize: 17,
                textAlign: "center",
              }}
            >
              ¿Qué deseas hacer con{" "}
              <Text style={{ fontWeight: "bold" }}>
                {modalMascota?.nombre}
              </Text>
              ?
            </Text>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#3CA374" }]}
              onPress={() => handleAdoptar(modalMascota.id_mascota)}
            >
              <Text style={styles.modalBtnText}>Adoptar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#C62828" }]}
              onPress={() =>
                handleEliminarFavorito(modalMascota.id_mascota)
              }
            >
              <Text style={styles.modalBtnText}>Eliminar Favorito</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#777" }]}
              onPress={closeModal}
            >
              <Text style={styles.modalBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
  },

  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    overflow: "hidden",
    paddingBottom: 14,
    alignItems: "center",
  },

  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modal: {
    width: "100%",
    maxWidth: 360,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },

  modalBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    marginBottom: 12,
  },

  modalBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});