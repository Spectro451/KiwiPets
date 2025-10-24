import { useCallback, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { getMascotas } from "../../services/fetchMascotas";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export default function EditarMascotasScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [itemWidth, setItemWidth] = useState(150); // valor default

  useFocusEffect(
    useCallback(() => {
      const fetchAsync = async () => {
        try {
          const data = await getMascotas();
          setMascotas(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchAsync();
    }, [])
  );

  const handleEdit = (id_mascota: number) => {
    console.log("Editando mascota con id:", id_mascota);
    navigation.navigate("FormularioEditarMascota", { id_mascota });
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
          <Text style={[styles.title, { color: theme.colors.text }]}>Editar Mascotas</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{padding:10}}>
            <Text style={{ color: theme.colors.text, fontSize:20 }}>← Volver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid} onLayout={onGridLayout}>
          {mascotas.map(item => (
            <TouchableOpacity
              key={item.id_mascota}
              style={[styles.itemContainer, {width: itemWidth, backgroundColor: theme.colors.backgroundSecondary, borderColor:theme.colors.backgroundTertiary}]}
              onPress={() => handleEdit(item.id_mascota)}
              activeOpacity={0.7}
            >
              <Image
                source={item.foto ? { uri: item.foto } : undefined}
                style={[styles.image, { height: itemWidth }]}
              />
              <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
                {item.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  itemContainer: {marginBottom: 10, alignItems: "flex-start", padding:5, borderWidth:2, borderRadius:10 },
  image: { width: '100%', borderRadius: 10, marginBottom: 5, resizeMode: 'stretch' },
  name: { fontSize: 14, fontWeight: "bold", textAlign: "center", width: "100%" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
