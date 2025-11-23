import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import { getRefugio, updateRefugio } from "../services/fetchRefugio";
import { useFocusEffect } from "@react-navigation/native";

interface Props {
  user: { id: number; tipo: string; admin: boolean };
}

export default function ValidarRefugioScreen({ user }: Props) {
  const { theme } = useTheme();
  const [refugios, setRefugios] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refugioSeleccionado, setRefugioSeleccionado] = useState<any>(null);
  const [validadoTemp, setValidadoTemp] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const fetchRefugios = async () => {
        const data = await getRefugio();
        setRefugios(data);
      };
      fetchRefugios();
    }, [])
  );

  const openModal = (refugio: any) => {
    setRefugioSeleccionado(refugio);
    setValidadoTemp(refugio.validado);
    setModalVisible(true);
  };

  const handleGuardar = async () => {
    if (!refugioSeleccionado) return;
    try {
      const updated = await updateRefugio(refugioSeleccionado.id, { validado: validadoTemp });
      
      // Actualizar solo el refugio en la lista
      setRefugios(prev =>
        prev.map(r => r.id === updated.id ? { ...r, validado: updated.validado } : r)
      );

      setModalVisible(false);
      setRefugioSeleccionado(null);
    } catch (error) {
      console.error(error);
    }
  };


  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.refugioContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.backgroundTertiary }]}
      onPress={() => user.admin && openModal(item)}
    >
      <Text style={[styles.refugioNombre, { color: theme.colors.text }]}>{item.nombre}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={[styles.refugioInfo, { color: theme.colors.textSecondary }]}>{item.direccion}</Text>
        <Text style={[styles.refugioInfo, { color: theme.colors.textSecondary }]}>Tel: {item.telefono}</Text>
        <Text style={[styles.refugioInfo, { color: theme.colors.textSecondary }]}>Validado: {item.validado ? "Sí" : "No"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Text style={[styles.titulo, { color: theme.colors.text }]}>
        Validar Refugios
      </Text>
      <View style={{ flex: 1 }}>
        <FlatList
          data={refugios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 15 }}
        />
      </View>

      {/* Modal de validación */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              Validar refugio {refugioSeleccionado?.nombre}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 }}>
              <Text style={{ color: theme.colors.text }}>Validado</Text>
              <Switch
                value={validadoTemp}
                onValueChange={setValidadoTemp}
                trackColor={{ false: "#ccc", true: "green" }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => { setModalVisible(false); setRefugioSeleccionado(null); }}
                style={styles.modalButton}
              >
                <Text style={{ color: theme.colors.text }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGuardar}
                style={styles.modalButton}
              >
                <Text style={{ color: "green" }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  refugioContainer: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 12 },
  refugioNombre: { fontWeight: "bold", fontSize: 17 },
  refugioInfo: { fontSize: 14, marginTop: 4 },
  modalBackground: { flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'center', alignItems:'center' },
  modalContainer: { width: 280, padding: 20, borderRadius: 10 },
  modalText: { fontSize: 17, fontWeight:'bold', textAlign:'center', marginBottom: 15 },
  modalButtons: { flexDirection:'row', justifyContent:'space-between' },
  modalButton: { padding:10 },
  titulo: {
  fontSize: 26,
  fontWeight: "bold",
  textAlign: "center"
  },
});
