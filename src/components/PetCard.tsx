import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Button, Platform, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext"; // Ajusta la ruta

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export type Pet = {
  nombre: string;
  raza: string;
  foto: string;
  edad?: string;
  tamano?: string;
  genero?: string;
  vacunado?: boolean;
  esterilizado?: boolean;
  descripcion?: string;
  personalidad?: string;
  tiempo_en_refugio?: string;
};

type PetCardProps = {
  pet: Pet;
};

export default function PetCardWithButtons({ pet }: PetCardProps) {
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      <View style={[styles.card, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: pet.foto }} style={styles.image} resizeMode="cover" />
          <View style={[styles.Overlay, { backgroundColor: theme.colors.overlayBackground }]}>
            <Text
              style={[
                styles.nombre,
                { color: theme.colors.overlayText, textShadowColor: theme.colors.overlayTextShadow },
              ]}
            >
              {pet.nombre}
            </Text>
            <Text
              style={[
                styles.raza,
                { color: theme.colors.overlayText, textShadowColor: theme.colors.overlayTextShadow },
              ]}
            >
              {pet.raza}
            </Text>
          </View>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.colors.backgroundTertiary }]}>
          {pet.edad && (
            <View style={[styles.stats, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <Text style={[styles.statText, { color: theme.colors.primary}]}>{pet.edad}</Text>
            </View>
          )}
          {pet.tamano && (
            <View style={[styles.stats, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <Text style={[styles.statText, { color: theme.colors.primary}]}>{pet.tamano}</Text>
            </View>
          )}
          {pet.genero && (
            <View style={[styles.stats, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <Text style={[styles.statText, { color: theme.colors.primary}]}>{pet.genero}</Text>
            </View>
          )}
          {pet.esterilizado !== undefined && (
            <View style={[styles.stats, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <Text style={[styles.statText, { color: theme.colors.primary}]}>
                {pet.esterilizado ? "Esterilizado" : "No esterilizado"}
              </Text>
            </View>
          )}
        </View>

        <ScrollView style={[styles.descripcion, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.descripcionText, { color: theme.colors.text }]}>
            {pet.descripcion && <Text>{pet.descripcion + "\n\n"}</Text>}
            {pet.personalidad && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Personalidad: </Text>
                {pet.personalidad + "\n"}
              </Text>
            )}
            {pet.tiempo_en_refugio && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Tiempo en refugio: </Text>
                {pet.tiempo_en_refugio}
              </Text>
            )}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]} onPress={() => {}}>
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]} onPress={() => {}}>
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Favorito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]} onPress={() => {}}>
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Siguiente</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

//para los anchos web/móvil
const CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 480);
const CARD_HEIGHT = isWeb ? CARD_WIDTH * 1.6 : CARD_WIDTH * 1.7;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    alignSelf: "center",
    marginVertical: 10,
  },
  imageContainer: {
    width: "100%",
    height: "65%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  Overlay: {
    position: "absolute",
    bottom: 0,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  nombre: {
    fontSize: 30,
    fontWeight: "bold",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  raza: {
    fontSize: 18,
    marginTop: 2,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    width: "100%",
  },
  stats: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  statText: {
    fontSize: 13,
  },
  descripcion: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  descripcionText: {
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    margin: 10,
  },
  button: {
    width: 65,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
