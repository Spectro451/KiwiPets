import { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { getMascotas } from "../../services/fetchMascotas";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export default function MisMascotasScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isSmall = width <= 480;
  const isTablet = width > 480 && width <= 840;
  const CONTENT_WIDTH = isSmall ? "100%" : isTablet ? 500 : 900;
  const GRID_PADDING_HORIZONTAL = isSmall ? 12 : 20;

  const [mascotas, setMascotas] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<any>(null);
  const [itemWidth, setItemWidth] = useState(150);

  useFocusEffect(
    useCallback(() => {
      const fetchMascotasAsync = async () => {
        try {
          const data = await getMascotas();
          setMascotas(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMascotasAsync();
    }, [])
  );

  const onGridLayout = (event: any) => {
    const layoutWidth = event.nativeEvent.layout.width;
    const minWidth = isSmall ? 160 : 150;
    

    let cols = Math.floor(layoutWidth / minWidth);
    if (cols > 5) cols = 5;
    if (cols < 1) cols = 1;

    const gap = isSmall ? 10 : 14;
    const calculatedWidth = (layoutWidth - gap * (cols - 1)) / cols;

    setItemWidth(calculatedWidth);
  };

  const openModal = (mascota: any) => {
    setSelectedMascota(mascota);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: GRID_PADDING_HORIZONTAL,
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Mis Mascotas
          </Text>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Text style={{ color: theme.colors.text, fontSize: 18 }}>← Volver</Text>
          </TouchableOpacity>
        </View>

        <View
          onLayout={onGridLayout}
          style={[
            styles.grid,
            {
              width: CONTENT_WIDTH,
              alignSelf: "center",
              gap: isSmall ? 12 : 16, // igual que BorrarMascotas
            },
          ]}
        >
          {mascotas.map((item) => (
            <TouchableOpacity
              key={item.id_mascota}
              style={[
                styles.itemContainer,
                {
                  width: itemWidth,
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.backgroundTertiary,
                },
              ]}
              activeOpacity={0.75}
              onPress={() => openModal(item)}
            >
              <View style={{ width: "100%", aspectRatio: 1 }}>
                <Image
                  source={item.foto ? { uri: item.foto } : undefined}
                  style={styles.image}
                />
              </View>

              <Text
                style={[
                  styles.name,
                  { color: theme.colors.text },
                ]}
                numberOfLines={1}
              >
                {item.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ---------------- MODAL ---------------- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.backgroundTertiary,
              },
            ]}
          >
            <ScrollView style={{ width: "100%" }}>
              {selectedMascota && (
                <>
                  <Text
                    style={[
                      styles.modalTitle,
                      { color: theme.colors.text },
                    ]}
                  >
                    {selectedMascota.nombre}
                  </Text>

                  <Image
                    source={
                      selectedMascota.foto
                        ? { uri: selectedMascota.foto }
                        : undefined
                    }
                    style={styles.modalImage}
                  />

                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ color: theme.colors.text }}>
                      Especie: {selectedMascota.especie}
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Raza: {selectedMascota.raza}
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Edad: {selectedMascota.edad} años
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Género: {selectedMascota.genero}
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Tamaño: {selectedMascota.tamaño}
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Vacunado: {selectedMascota.vacunado ? "Sí" : "No"}
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Esterilizado: {selectedMascota.esterilizado ? "Sí" : "No"}
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Discapacidad: {selectedMascota.discapacidad ? "Sí" : "No"}
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Requisitos adopción: {selectedMascota.requisito_adopcion}
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Personalidad: {selectedMascota.personalidad}
                    </Text>
                    <Text style={{ color: theme.colors.text }}>
                      Descripción: {selectedMascota.descripcion}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.colors.backgroundTertiary,
                },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={{
                  color: theme.colors.text,
                  fontWeight: "bold",
                }}
              >
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  itemContainer: {
    marginBottom: 14,
    borderWidth: 2,
    borderRadius: 12,
    padding: 6,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalContent: {
    width: 350,
    maxHeight: "85%",
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: "cover",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
