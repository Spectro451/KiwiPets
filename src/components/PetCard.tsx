import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Button, Platform, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext"; // Ajusta la ruta

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export type Vacuna = {
  id?: string;
  nombre: string;
  fecha_aplicacion: string;
  proxima_dosis?: string;
  observaciones?: string;
};

export type HistorialClinico = {
  id?: string;
  fecha: string;
  descripcion: string;
  veterinario?: string;
  tratamiento?: string;
};

export type Pet = {
  id?: string;
  refugio_id?: string;
  nombre?: string;
  raza?: string;
  foto?: string;
  edad?: string;
  tamano?: string;
  especie?: string;
  genero?: string;
  vacunado?: boolean;
  esterilizado?: boolean;
  veces_adoptado?: number;
  tiempo_en_refugio?: string;
  discapacidad?: boolean;
  descripcion?: string;
  personalidad?: string;
  posee_descendencia?: boolean;
  fecha_ingreso?: string;
  requisitos_adopcion?: string;

  vacunas?: Vacuna[];
  historial_clinico?: HistorialClinico[];
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
          {/* foto */}
          <Image source={{ uri: pet.foto }} style={styles.image} resizeMode="cover" />
          {/* overlay */}
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
        {/* stats */}        
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
        {/* detalles */}     
        <ScrollView style={[styles.descripcion, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.descripcionText, { color: theme.colors.text }]}>
            {pet.descripcion && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Sobre mí: </Text>
                {pet.descripcion + "\n"}
              </Text>
            )}

            <Text>
              <Text style={{ fontWeight: "bold" }}>Vacunado: </Text>
              {pet.vacunado ? "Sí\n" : "No\n"}
            </Text>

            {pet.veces_adoptado !== undefined && pet.veces_adoptado !== null && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Me han adoptado: </Text>
                {pet.veces_adoptado + " veces\n"}
              </Text>
            )}

            <Text>
              <Text style={{ fontWeight: "bold" }}>Poseo discapacidad: </Text>
              {pet.discapacidad ? "Sí\n" : "No\n"}
            </Text>

            <Text>
              <Text style={{ fontWeight: "bold" }}>Tengo descendencia: </Text>
              {pet.posee_descendencia ? "Sí\n" : "No\n"}
            </Text>

            {pet.requisitos_adopcion && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Requiero lo siguiente para ser adoptado: </Text>
                {pet.requisitos_adopcion + "\n"}
              </Text>
            )}

            {pet.personalidad && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Personalidad: </Text>
                {pet.personalidad + "\n"}
              </Text>
            )}

            {pet.tiempo_en_refugio && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Tiempo en refugio: </Text>
                {pet.tiempo_en_refugio + "\n"}
              </Text>
            )}

            {/* Vacunas */}
            {(pet.vacunas?.length ?? 0) > 0 && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Vacunas:</Text>
                {(pet.vacunas ?? []).map((v, i) => (
                  <Text key={v.id || i}>
                    {"\n"}Nombre: {v.nombre}{"\n"}
                    Fecha de aplicación: {v.fecha_aplicacion}{"\n"}
                    {v.proxima_dosis && <>Próxima dosis: {v.proxima_dosis}{"\n"}</>}
                    {v.observaciones && <>Observaciones: {v.observaciones}{"\n"}</>}
                    
                  </Text>
                ))}
              </Text>
            )}

            {/* Historial clínico */}
            {(pet.historial_clinico?.length ?? 0) > 0 && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Historial clínico:</Text>
                {(pet.historial_clinico ?? []).map((h, i) => (
                  <Text key={h.id || i}>
                    {"\n"}Fecha: {h.fecha}{"\n"}
                    Descripción: {h.descripcion}{"\n"}
                    {h.veterinario && <>Veterinario: {h.veterinario}{"\n"}</>}
                    {h.tratamiento && <>Tratamiento: {h.tratamiento}{"\n"}</>}
                  </Text>
                ))}
              </Text>
            )}
          </Text>
        </ScrollView>
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
    resizeMode: "cover",
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
});
