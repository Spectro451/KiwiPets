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

  const isSmall = width <= 480;
  const isTablet = width > 480 && width <= 840;

  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMascota, setModalMascota] = useState<any>(null);

  const [itemWidth, setItemWidth] = useState(180);

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

  const onGridLayout = (event: any) => {
    const gridWidth = event.nativeEvent.layout.width;

    const minWidth = isSmall ? 150 : isTablet ? 160 : 180;

    let cols = Math.floor(gridWidth / minWidth);
    if (cols < 1) cols = 1;
    if (cols > 4) cols = 4;

    const gap = isSmall ? 10 : 14;
    const calculated = (gridWidth - gap * (cols - 1)) / cols;

    setItemWidth(calculated);
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

        {loading && (
          <View style={{ marginTop: 20 }}>
            <SkeletonCard width={itemWidth} />
            <SkeletonCard width={itemWidth} />
          </View>
        )}

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

        <View
          onLayout={onGridLayout}
          style={[
            styles.grid,
            {
              justifyContent: isSmall ? "space-between" : "flex-start",
              gap: isSmall ? 10 : 14,
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
                    width: itemWidth,
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderColor: theme.colors.backgroundTertiary,
                  },
                ]}
                activeOpacity={0.75}
                onPress={() => openModal(m)}
              >
                <View style={{ width: "100%", aspectRatio: 1 }}>
                  <Image
                    source={{
                      uri:
                        m.foto ||
                        m.mascota?.foto ||
                        "https://via.placeholder.com/400x400?text=Sin+Foto",
                    }}
                    style={styles.img}
                  />
                </View>

                <Text
                  style={[
                    styles.name,
                    { color: theme.colors.text },
                  ]}
                  numberOfLines={1}
                >
                  {m.nombre || m.mascota?.nombre || "Sin nombre"}
                </Text>

                <PetSwipe
                  mascota={m}
                  onToggleFavorito={() => handleEliminarFavorito(m.id_mascota)}
                />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

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
              style={[
                styles.modalBtn,
                { backgroundColor: theme.colors.accent },
              ]}
              onPress={() => handleAdoptar(modalMascota.id_mascota)}
            >
              <Text style={styles.modalBtnText}>Adoptar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: theme.colors.error },
              ]}
              onPress={() =>
                handleEliminarFavorito(modalMascota.id_mascota)
              }
            >
              <Text style={styles.modalBtnText}>Eliminar Favorito</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: theme.colors.backgroundTertiary },
              ]}
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
    width: "100%",
  },

  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 6,
    marginBottom: 14,
    alignItems: "center",
  },

  img: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
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
