import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Platform } from "react-native";
import { useTheme } from "../theme/ThemeContext"; // Ajusta la ruta

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export type Vacuna = {
  id: number;
  nombre: string;
  fecha_aplicacion: string;
  proxima_dosis?: string;
  observaciones?: string;
};

export type HistorialClinico = {
  id: number;
  fecha: string;
  descripcion: string;
  veterinario?: string;
  tratamiento?: string;
};

export type Pet = {
  id_mascota: number;
  refugio: { nombre?: string };
  nombre: string;
  raza: string;
  foto?: string;
  edad: number;
  tamaño: string;
  especie: string;
  genero: string;
  vacunado: boolean;
  esterilizado: boolean;
  veces_adoptado: number;
  discapacidad: boolean;
  descripcion: string;
  personalidad: string;
  posee_descendencia: boolean;
  fecha_ingreso: string;
  requisito_adopcion: string;
  estado_adopcion: string;

  vacunas: Vacuna[];
  historialClinico: HistorialClinico[];
};

type PetCardProps = {
  pet: Pet;
};

export default function PetCardWithButtons({ pet }: PetCardProps) {
  const { theme } = useTheme();

  function formatFecha(fechaStr: string) {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  function tiempoEnRefugio(fechaIngresoStr: string) {
    const fechaIngreso = new Date(fechaIngresoStr);
    const diffMs = Date.now() - fechaIngreso.getTime();
    const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const años = Math.floor(dias / 365);
    const meses = Math.floor((dias % 365) / 30);
    const diasRestantes = (dias % 365) % 30;

    return [
      años ? `${años} año${años > 1 ? "s" : ""}` : null,
      meses ? `${meses} mes${meses > 1 ? "es" : ""}` : null,
      diasRestantes ? `${diasRestantes} día${diasRestantes > 1 ? "s" : ""}` : null
    ].filter(Boolean).join(", ") || "Hoy";
  }
  const tiempo = pet.fecha_ingreso ? tiempoEnRefugio(pet.fecha_ingreso) : "";

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
              <Text style={[styles.statText, { color: theme.colors.primary}]}>{pet.edad} años</Text>
            </View>
          )}
          {pet.tamaño && (
            <View style={[styles.stats, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <Text style={[styles.statText, { color: theme.colors.primary}]}>{pet.tamaño}</Text>
            </View>
          )}
          {pet.genero && (
            <View style={[styles.stats, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <Text style={[styles.statText, { color: theme.colors.primary}]}>{pet.genero}</Text>
            </View>
          )}
          {pet.estado_adopcion !== undefined && (
            <View style={[styles.stats, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <Text style={[styles.statText, { color: theme.colors.primary}]}>
                {pet.estado_adopcion}
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

            {/* Refugio: SOLO nombre si viene */}
            {pet.refugio?.nombre && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Refugio: </Text>
                {pet.refugio.nombre + "\n"}
              </Text>
            )}

            {/* Especie */}
            {pet.especie && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Especie: </Text>
                {pet.especie + "\n"}
              </Text>
            )}

            {/* Esterilizado */}
            <Text>
              <Text style={{ fontWeight: "bold" }}>Esterilizado: </Text>
              {pet.esterilizado ? "Sí\n" : "No\n"}
            </Text>

            {/* Vacunado */}
            <Text>
              <Text style={{ fontWeight: "bold" }}>Vacunado: </Text>
              {pet.vacunado ? "Sí\n" : "No\n"}
            </Text>

            {/* Veces adoptado */}
            {pet.veces_adoptado !== undefined && pet.veces_adoptado !== null && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Me han adoptado: </Text>
                {pet.veces_adoptado + " veces\n"}
              </Text>
            )}

            {/* Discapacidad */}
            <Text>
              <Text style={{ fontWeight: "bold" }}>Poseo discapacidad: </Text>
              {pet.discapacidad ? "Sí\n" : "No\n"}
            </Text>

            {/* Descendencia */}
            <Text>
              <Text style={{ fontWeight: "bold" }}>Tengo descendencia: </Text>
              {pet.posee_descendencia ? "Sí\n" : "No\n"}
            </Text>

            {pet.requisito_adopcion && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Requiero lo siguiente para ser adoptado: </Text>
                {pet.requisito_adopcion + "\n"}
              </Text>
            )}

            {pet.personalidad && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Personalidad: </Text>
                {pet.personalidad + "\n"}
              </Text>
            )}

            {/* Tiempo (calculado a partir de fecha_ingreso) */}
            {tiempo && (
              <Text>
                <Text style={{ fontWeight: "bold" }}>Tiempo en refugio: </Text>
                {tiempo + "\n"}
              </Text>
            )}

{/* Vacunas */}
{(pet.vacunas?.length ?? 0) > 0 && (
  <Text>
    <Text style={{ fontWeight: "bold" }}>Vacunas:</Text>
    {(pet.vacunas ?? []).map((v, i) => (
      <Text key={v.id || i}>
        {"\n"}{"\t"}<Text style={{ fontWeight: "bold" }}>Nombre: </Text>{v.nombre}{"\n"}
        {"\t"}<Text style={{ fontWeight: "bold" }}>Fecha de aplicación: </Text>{formatFecha(v.fecha_aplicacion)}{"\n"}
        {v.proxima_dosis && <>{"\t"}<Text style={{ fontWeight: "bold" }}>Próxima dosis: </Text>{formatFecha(v.proxima_dosis)}{"\n"}</>}
        {v.observaciones && <>{"\t"}<Text style={{ fontWeight: "bold" }}>Observaciones: </Text>{v.observaciones}{"\n"}</>}
      </Text>
    ))}
  </Text>
)}

{/* Historial clínico */}
{(pet.historialClinico?.length ?? 0) > 0 && (
  <Text>
    <Text style={{ fontWeight: "bold" }}>Historial clínico:</Text>
    {(pet.historialClinico ?? []).map((h, i) => (
      <Text key={h.id || i}>
        {"\n"}{"\t"}<Text style={{ fontWeight: "bold" }}>Fecha: </Text>{formatFecha(h.fecha)}{"\n"}
        {"\t"}<Text style={{ fontWeight: "bold" }}>Descripción: </Text>{h.descripcion}{"\n"}
        {h.veterinario && <>{"\t"}<Text style={{ fontWeight: "bold" }}>Veterinario: </Text>{h.veterinario}{"\n"}</>}
        {h.tratamiento && <>{"\t"}<Text style={{ fontWeight: "bold" }}>Tratamiento: </Text>{h.tratamiento}{"\n"}</>}
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
