import { useCallback, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { getMascotas } from "../../services/fetchMascotas";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Checkbox from "expo-checkbox";

export default function TransferirMascotas({ navigation }: any) {
  const { theme } = useTheme();
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemWidth, setItemWidth] = useState(150); // valor default

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
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(mascotas.map(m => m.id_mascota));
      setSelectAll(true);
    }
  };

  const onGridLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    const minWidth = 150;
    let cols = Math.floor(width / minWidth);

    // limite de columna
    if (cols > 5) cols = 5;
    if (cols < 1) cols = 1;

    const space = 10;
    const calculatedWidth = (width - space * (cols - 1)) / cols;
    setItemWidth(calculatedWidth);
  };

  return (
    <SafeAreaView edges={['top','bottom']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Seleccionar Mascotas</Text>
          <TouchableOpacity onPress={() => {navigation.goBack(); setSelectedIds([]);}} style={{padding:10}}>
            <Text style={{ color: theme.colors.text, fontSize:20 }}>← Volver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={toggleSelectAll} style={styles.actionButton}>
            <Text style={{ color: theme.colors.text }}>
              {selectAll ? "Deseleccionar todo" : "Seleccionar todo"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.actionButton}>
            <Text style={{ color: "green" }}>Transferir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid} onLayout={onGridLayout}>
          {mascotas.map(item => (
            <TouchableOpacity
              key={item.id_mascota}
              style={[styles.itemContainer, {width: itemWidth, backgroundColor: theme.colors.backgroundSecondary, borderColor:theme.colors.backgroundTertiary}]}
              onPress={() => toggleSelect(item.id_mascota)}
              activeOpacity={0.7}
            >
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={selectedIds.includes(item.id_mascota)}
                  onValueChange={() => toggleSelect(item.id_mascota)}
                  color={selectedIds.includes(item.id_mascota) ? theme.colors.accent : undefined}
                />
              </View>
              <Image
                source={item.foto ? { uri: item.foto } : undefined}
                style={[styles.image, {height: itemWidth,}]}
              />
              <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
                {item.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalBackground]}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              {selectedIds.length === 0 
                ? "Debe seleccionar al menos una mascota"
                : `¿Transferir ${selectedIds.length} mascota(s)?`}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => { setModalVisible(false); setSelectedIds([]); }} 
                style={styles.modalButton}
              >
                <Text style={{ color: theme.colors.text }}>Cancelar</Text>
              </TouchableOpacity>
              {selectedIds.length > 0 && (
                <TouchableOpacity 
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("SeleccionarRefugio", { selectedIds });
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
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  actionButton: { padding: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  itemContainer: { marginBottom: 10, alignItems: "center", padding: 5, borderWidth: 2, borderRadius: 10 },
  checkboxContainer: { marginBottom: 5 },
  image: { width: '100%', borderRadius: 10, marginBottom: 5, resizeMode: 'stretch' },
  name: { fontSize: 14, fontWeight: "bold", textAlign: "center", width: "100%" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalBackground: { flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'center', alignItems:'center' },
  modalContainer: { width: 280, padding: 20, borderRadius: 10 },
  modalText: { fontSize: 18, fontWeight:'bold', textAlign:'center', marginBottom: 15 },
  modalButtons: { flexDirection:'row', justifyContent:'space-between' },
  modalButton: { padding:10 },
  
});
