import { useCallback, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { getMascotas } from "../../services/fetchMascotas";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const ITEM_WIDTH = Dimensions.get("window").width / 3 - 15; // 3 columnas con margen

export default function MisMascotasScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [mascotas, setMascotas] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchMascotas = async () => {
        try {
          const data = await getMascotas();
          setMascotas(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMascotas();
    }, [])
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Mis Mascotas</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{padding:10}}>
            <Text style={{ color: theme.colors.text, fontSize:20 }}>← Volver</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {mascotas.map((item) => (
            <View key={item.id_mascota} style={[styles.itemContainer, {backgroundColor:theme.colors.backgroundSecondary, borderColor:theme.colors.backgroundTertiary}]}>
              <Image
                source={item.foto ? { uri: item.foto } : undefined}
                style={styles.image}
              />
              <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
                {item.nombre}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",marginBottom: 20 },
  itemContainer: { width: ITEM_WIDTH, marginBottom: 10, alignItems: "center", padding:5, borderWidth:2, borderRadius:10 },
  image: { width: '100%', height: ITEM_WIDTH, borderRadius: 10, marginBottom: 5, resizeMode:"stretch" },
  name: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',},
});
