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
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Checkbox from "expo-checkbox";

import { getMascotas, deleteMascotas } from "../../services/fetchMascotas";

export default function BorrarMascotasScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const isSmall = width <= 480;
  const isTablet = width > 480 && width <= 840;
  const CONTENT_WIDTH = isSmall ? "100%" : isTablet ? 500 : 900;
  const GRID_PADDING_HORIZONTAL = isSmall ? 12 : 20;

  const [mascotas, setMascotas] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemWidth, setItemWidth] = useState(150);

  useFocusEffect(
    useCallback(() => {
      const fetchAsync = async () => {
        const data = await getMascotas();
        setMascotas(data);
        setSelectedIds([]);
        setSelectAll(false);
      };
      fetchAsync();
    }, [])
  );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(mascotas.map((m) => m.id_mascota));
      setSelectAll(true);
    }
  };

  const handleDelete = async () => {
    await Promise.all(selectedIds.map((id) => deleteMascotas(id)));

    const data = await getMascotas();
    setMascotas(data);
    setSelectedIds([]);
    setSelectAll(false);
    setModalVisible(false);
  };

  const onGridLayout = (event: any) => {
    const layoutWidth = event.nativeEvent.layout.width;
    const minWidth = isSmall ? 160 : 150;

    let cols = Math.floor(layoutWidth / minWidth);
    if (isSmall) cols = 2;

    if (cols > 5) cols = 5;
    if (cols < 1) cols = 1;

    const gap = isSmall ? 12 : 16;
    const calculatedWidth = (layoutWidth - gap * (cols - 1)) / cols;

    setItemWidth(calculatedWidth);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
  contentContainerStyle={{
    paddingHorizontal: isSmall ? 12 : 20,
    paddingTop: 16,
    paddingBottom: 40,
  }}
>


          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Borrar Mascotas
            </Text>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: theme.colors.text, fontSize: 20 }}>
                ← Volver</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.actions, { width: CONTENT_WIDTH }]}>
            <TouchableOpacity onPress={toggleSelectAll} style={styles.actionButton}>
              <Text style={{ color: theme.colors.text }}>
                {selectAll ? "Deseleccionar todo" : "Seleccionar todo"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.actionButton}
            >
              <Text style={{ color: theme.colors.error }}>Borrar</Text>
            </TouchableOpacity>
          </View>

          <View
            onLayout={onGridLayout}
            style={[
              styles.grid,
              {
                width: CONTENT_WIDTH,
                alignSelf: "center",
                gap: isSmall ? 12 : 16,
              },
            ]}
          >
            {mascotas.map((item) => (
              <View
                key={item.id_mascota}
                style={[
                  styles.itemContainer,
                  {
                    width: itemWidth,
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderColor: theme.colors.backgroundTertiary,
                  },
                ]}
              >
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={selectedIds.includes(item.id_mascota)}
                    onValueChange={() => toggleSelect(item.id_mascota)}
                    color={
                      selectedIds.includes(item.id_mascota)
                        ? theme.colors.accent
                        : undefined
                    }
                  />
                </View>

                <TouchableOpacity
                  onPress={() => toggleSelect(item.id_mascota)}
                  activeOpacity={0.7}
                  style={{ width: "100%" }}
                >
                  <View style={{ width: "100%", aspectRatio: 1 }}>
                    <Image
                      source={
                        item.foto
                          ? { uri: item.foto }
                          : { uri: "https://via.placeholder.com/400?text=Sin+Foto" }
                      }
                      style={styles.image}
                    />
                  </View>

                  <Text
                    style={[styles.name, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {item.nombre}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          
        </View>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.backgroundTertiary,
              },
            ]}
          >
            <Text
              style={[styles.modalText, { color: theme.colors.text }]}
            >
              {selectedIds.length === 0
                ? "Debe seleccionar al menos una mascota"
                : `¿Borrar ${selectedIds.length} mascota(s)?`}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={{ color: theme.colors.text }}>Cancelar</Text>
              </TouchableOpacity>

              {selectedIds.length > 0 && (
                <TouchableOpacity onPress={handleDelete} style={styles.modalButton}>
                  <Text style={{ color: theme.colors.error }}>Borrar</Text>
                </TouchableOpacity>
              )}
            </View>
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
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  itemContainer: {
    padding: 8,
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: 10,
  },

  checkboxContainer: {
    marginBottom: 6,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1.5,
  },

  modalText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
});
