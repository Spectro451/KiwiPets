import { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { getMascotas } from "../../services/fetchMascotas";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Checkbox from "expo-checkbox";

export default function Transferir({ navigation }: any) {
  const { theme } = useTheme();
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemWidth, setItemWidth] = useState(150);

  // ------------------- LOAD -------------------
  useFocusEffect(
    useCallback(() => {
      const fetchAsync = async () => {
        try {
          const data = await getMascotas();
          setMascotas(data);
          setSelectedIds([]);
          setSelectAll(false);
        } catch (error) {
          console.error("Error cargando mascotas:", error);
        }
      };
      fetchAsync();
    }, [])
  );

  // ------------------- SELECT -------------------
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

  // ------------------- GRID -------------------
  const onGridLayout = (event: any) => {
    const layoutWidth = event.nativeEvent.layout.width;

    const isSmall = layoutWidth <= 480;
    const isTablet = layoutWidth > 480 && layoutWidth <= 840;

    const minWidth = isSmall ? 150 : 170;

    let cols = Math.max(1, Math.floor(layoutWidth / minWidth));
    if (!isSmall) cols = Math.min(cols, 5);

    const gap = isSmall ? 10 : 14;
    const calculated = (layoutWidth - gap * (cols - 1)) / cols;

    setItemWidth(calculated);
  };

  // ------------------- UI -------------------
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Transferir Mascotas
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              setSelectedIds([]);
            }}
            style={{ padding: 10 }}
          >
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>
              ← Volver
            </Text>
          </TouchableOpacity>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={toggleSelectAll} style={styles.actionBtn}>
            <Text style={{ color: theme.colors.text }}>
              {selectAll ? "Deseleccionar todo" : "Seleccionar todo"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.actionBtn}
          >
            <Text style={{ color: "green" }}>Transferir</Text>
          </TouchableOpacity>
        </View>

        {/* GRID */}
        <View
          style={[
            styles.grid,
            {
              justifyContent: "center",   // Centra la grilla
              alignSelf: "center",        // Alinea contenedor en el centro
            },
          ]}
          onLayout={onGridLayout}
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
              onPress={() => toggleSelect(item.id_mascota)}
              activeOpacity={0.7}
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

              <Image
                source={item.foto ? { uri: item.foto } : undefined}
                style={[
                  styles.image,
                  {
                    height: itemWidth,
                  },
                ]}
              />

              <Text
                style={[styles.name, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {item.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              {selectedIds.length === 0
                ? "Debe seleccionar al menos una mascota"
                : `¿Transferir ${selectedIds.length} mascota(s)?`}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={styles.modalButton}
              >
                <Text style={{ color: theme.colors.text }}>Cancelar</Text>
              </TouchableOpacity>

              {selectedIds.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("SeleccionarRefugio", {
                      selectedIds,
                    });
                  }}
                  style={styles.modalButton}
                >
                  <Text style={{ color: "green" }}>Sí</Text>
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
  container: { flex: 1, padding: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 10,
  },
  actionBtn: { padding: 8 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 12,
  },

  itemContainer: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  checkboxContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  image: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 6,
    resizeMode: "cover",
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    width: "100%",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    padding: 22,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: { padding: 10 },
});
