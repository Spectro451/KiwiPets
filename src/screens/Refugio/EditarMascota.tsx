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
  const isSmallScreen = width < 620;
  const isWeb = Platform.OS === "web";

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
    const gridWidth = event.nativeEvent.layout.width;

    const minWidth = isSmallScreen ? 160 : 150;
    let cols = Math.max(1, Math.floor(gridWidth / minWidth));

    if (!isSmallScreen) cols = Math.min(cols, 5);

    const gap = isSmallScreen ? 12 : 16;
    const calculated = (gridWidth - gap * (cols - 1)) / cols;

    setItemWidth(calculated);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: isSmallScreen ? 12 : 24,
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
              width: isSmallScreen ? "100%" : 900,
              alignSelf: "center",
              gap: isSmallScreen ? 12 : 16,
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
                style={[
                  styles.name,
                  { color: theme.colors.text },
                ]}
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
  backgroundColor: "#222", // evita parpadeos negros en RN
  justifyContent: "center",
  alignItems: "center",
},

  image: {
  width: "100%",
  height: "100%",
  resizeMode: Platform.OS === "web" ? "contain" : "cover",
  ...(Platform.OS === "web" ? { objectFit: "cover" } : {}), // evita crash
},

  name: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
});
