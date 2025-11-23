import { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { getMascotas } from "../../services/fetchMascotas";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export default function EditarMascotasScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [itemWidth, setItemWidth] = useState(140);

  const { width } = useWindowDimensions();

  const isSmall = width <= 480;
  const isTablet = width > 480 && width <= 840;
  const CONTENT_WIDTH = isSmall ? "100%" : isTablet ? 500 : 900;
  const GRID_PADDING_HORIZONTAL = isSmall ? 12 : 20;


  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const data = await getMascotas();
          setMascotas(data);
        } catch (err) {
          console.log(err);
        }
      };
      load();
    }, [])
  );

  const handleEdit = (id_mascota: number) => {
    navigation.navigate("FormularioEditarMascota", { id_mascota });
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
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingHorizontal: GRID_PADDING_HORIZONTAL,
      paddingTop: 20,
      paddingBottom: 40,
    }}
  >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Editar mascotas
          </Text>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>
              ← Volver
            </Text>
          </TouchableOpacity>
        </View>

        {/* GRID */}
        <View
  onLayout={onGridLayout}
  style={[
    styles.grid,
    {
      width: CONTENT_WIDTH,  // ← como BorrarMascota
      alignSelf: "center",
      gap: isSmall ? 12 : 16,
    },
  ]}
>
          {mascotas.map((item) => (
            <TouchableOpacity
              key={item.id_mascota}
              onPress={() => handleEdit(item.id_mascota)}
              activeOpacity={0.78}
style={[
  styles.card,
  {
    width: itemWidth,
    backgroundColor: theme.colors.backgroundSecondary,
    borderColor: theme.colors.backgroundTertiary,
    padding: 8,               // igual que BorrarMascota
    borderWidth: 1.5,         // igual que BorrarMascota
    borderRadius: 14,         // igual que BorrarMascota
  },
]}
            >
              <View style={styles.imageBox}>
                <Image
                  source={item.foto ? { uri: item.foto } : undefined}
                  style={styles.image}
                />
              </View>

              <Text
                numberOfLines={1}
                style={[styles.name, { color: theme.colors.text }]}
              >
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },

  card: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },

  imageBox: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 6,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: Platform.OS === "web" ? "contain" : "cover",
    objectFit: "cover",
  },

 name: {
  fontSize: 14,
  fontWeight: "600",
  textAlign: "center",
  marginTop: 6,
}
});
