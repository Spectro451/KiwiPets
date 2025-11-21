import { useCallback, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { getMascotas, deleteMascotas } from "../../services/fetchMascotas";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { useWindowDimensions } from "react-native";

export default function BorrarMascotasScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  const [mascotas, setMascotas] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemWidth, setItemWidth] = useState(150);

  useFocusEffect(
    useCallback(() => {
      const fetchAsync = async () => {
        try {
          const data = await getMascotas();
          setMascotas(data);
          setSelectedIds([]);
          setSelectAll(false);
        } catch (error) {
          console.error(error);
        }
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
    try {
      await Promise.all(selectedIds.map((id) => deleteMascotas(id)));
      const data = await getMascotas();
      setMascotas(data);
      setSelectedIds([]);
      setSelectAll(false);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onGridLayout = (event: any) => {
    const layoutWidth = event.nativeEvent.layout.width;

    const minWidth = isSmallScreen ? 160 : 150;
    let cols = isSmallScreen ? 2 : Math.floor(layoutWidth / minWidth);

    if (cols > 5) cols = 5;
    if (cols < 1) cols = 1;

    const space = isSmallScreen ? 12 : 10;
    const calculatedWidth = (layoutWidth - space * (cols - 1)) / cols;
    setItemWidth(calculatedWidth);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: isSmallScreen ? 12 : 20,
        }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Borrar Mascotas</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>← Volver</Text>
          </TouchableOpacity>
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={toggleSelectAll} style={styles.actionButton}>
            <Text style={{ color: theme.colors.text }}>
              {selectAll ? "Deseleccionar todo" : "Seleccionar todo"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.actionButton}>
            <Text style={{ color: "red" }}>Borrar</Text>
          </TouchableOpacity>
        </View>

        {/* Grid */}
        <View
          onLayout={onGridLayout}
          style={[
            styles.grid,
            {
              gap: isSmallScreen ? 12 : 16,
              justifyContent: "flex-start",
              maxWidth: isSmallScreen ? "100%" : 900,
              alignSelf: "center",
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
                  padding: isSmallScreen ? 6 : 8,
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.backgroundTertiary,
                },
              ]}
            >
              {/* Checkbox */}
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
                    source={item.foto ? { uri: item.foto } : undefined}
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

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.background, borderColor: theme.colors.backgroundTertiary },
            ]}
          >
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
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
                  <Text style={{ color: "red" }}>Borrar</Text>
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
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  actionButton: { padding: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  itemContainer: { marginBottom: 10, borderWidth: 2, borderRadius: 12 },
  checkboxContainer: { marginBottom: 5 },
  image: { width: "100%", height: "100%", borderRadius: 10, resizeMode: "cover" },
  name: { fontSize: 14, fontWeight: "bold", textAlign: "center", width: "100%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    width: 280,
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  modalText: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: { padding: 10, alignItems: "center", flex: 1 },
});
