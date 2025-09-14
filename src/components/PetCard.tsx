import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Button, Platform } from "react-native";

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
  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      {/* Tarjeta */}
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: pet.foto }} style={styles.image} resizeMode="cover" />
          <View style={styles.infoOverlay}>
            <Text style={styles.nombre}>{pet.nombre}</Text>
            <Text style={styles.raza}>{pet.raza}</Text>
          </View>
        </View>

        <View style={styles.chipsContainer}>
          {pet.edad && <View style={styles.chip}><Text style={styles.chipText}>{pet.edad}</Text></View>}
          {pet.tamano && <View style={styles.chip}><Text style={styles.chipText}>{pet.tamano}</Text></View>}
          {pet.genero && <View style={styles.chip}><Text style={styles.chipText}>{pet.genero}</Text></View>}
          {pet.esterilizado !== undefined && <View style={styles.chip}><Text style={styles.chipText}>{pet.esterilizado ? "Esterilizado" : "No esterilizado"}</Text></View>}
        </View>

        <ScrollView style={styles.details}>
          <Text style={styles.detailText}>
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
        <Button title="Like" onPress={() => {}} />
        <Button title="Favorito" onPress={() => {}} />
        <Button title="Siguiente" onPress={() => {}} />
      </View>
    </View>
  );
}

const CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 480);
const CARD_HEIGHT = isWeb ? CARD_WIDTH * 1.6 : CARD_WIDTH * 1.7; // más alta en móvil

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
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
  infoOverlay: {
    position: "absolute",
    bottom: 10,
    left: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  nombre: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  raza: {
    color: "#fff",
    fontSize: 16,
    marginTop: 2,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  chipsContainer: {
    flexDirection: "row",
    justifyContent: "center", // centra horizontalmente
    alignItems: "center",     // centra verticalmente
    gap: 12,
    paddingVertical: 4,
    backgroundColor: "#fff",
    width: "100%",
  },
  chip: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    color: "#333",
  },
  details: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#fff",
  },
  detailText: {
    fontSize: 14,
    color: "#555",
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
  },
});
