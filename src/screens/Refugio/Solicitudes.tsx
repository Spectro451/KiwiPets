import { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { getAdopcion } from "../../services/fetchAdopcion";
import { Adopcion } from "../../types/adopcion";

interface MascotaSolicitudes {
  id: number;
  nombre: string;
  solicitudes: Adopcion[];
}

export default function Solicitudes({ navigation }: any) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isSmall = width <= 480;
  const isTablet = width > 480 && width <= 840;
  const CARD_WIDTH =
    width < 500
      ? width * 0.92
      : width < 900
        ? width * 0.85
        : 600;

  const [mascotas, setMascotas] = useState<MascotaSolicitudes[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const cargarSolicitudes = async () => {
    try {
      const adopciones: Adopcion[] = await getAdopcion();

      const filtradas = adopciones.filter(
        (a) => a.estado === "En proceso"
      );

      const agrupadas: Record<number, MascotaSolicitudes> = {};

      filtradas.forEach((adop) => {
        const idMascota = adop.mascota.id_mascota;

        if (!agrupadas[idMascota]) {
          agrupadas[idMascota] = {
            id: idMascota,
            nombre: adop.mascota.nombre,
            solicitudes: [],
          };
        }

        agrupadas[idMascota].solicitudes.push(adop);
      });

      setMascotas(Object.values(agrupadas));
    } catch (e) {
      console.error("Error cargando solicitudes:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarSolicitudes();
    }, [])
  );

  const renderMascota = ({ item }: { item: MascotaSolicitudes }) => {
    const abierto = expanded === item.id;

    return (
      <View
        style={[
          styles.cardMascota,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.backgroundTertiary,
          },
        ]}
      >
        {/* HEADER DE LA MASCOTA */}
        <TouchableOpacity
          onPress={() => setExpanded(abierto ? null : item.id)}
        >
          <Text
            style={[
              styles.nombreMascota,
              { color: theme.colors.text },
            ]}
          >
            {item.nombre}
          </Text>

          <Text
            style={[
              styles.subtitulo,
              { color: theme.colors.textSecondary },
            ]}
          >
            {item.solicitudes.length} solicitud(es)
          </Text>
        </TouchableOpacity>

        {/* CONTENIDO EXPANDIDO */}
        {abierto &&
          item.solicitudes.map((sol) => (
            <TouchableOpacity
              key={sol.id}
              style={[
                styles.cardSolicitud,
                { borderColor: theme.colors.backgroundTertiary },
              ]}
              onPress={() =>
                navigation.push("DetalleAdopcion", {
                  id: sol.id,
                })
              }
            >
              <Text
                style={[
                  styles.textoSolicitud,
                  { color: theme.colors.text },
                ]}
              >
                Adoptante: {sol.adoptante.nombre}
              </Text>

              <Text
                style={[
                  styles.estadoSolicitud,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {sol.estado}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View
        style={{
          padding: isSmall ? 12 : isTablet ? 16 : 20,
        }}
      >
        <Text
          style={[
            styles.titulo,
            { color: theme.colors.text },
          ]}
        >
          Mis Solicitudes
        </Text>

        {mascotas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { color: theme.colors.textSecondary },
              ]}
            >
              No hay solicitudes para tus mascotas aún.
            </Text>
          </View>
        ) : (
          <FlatList
            data={mascotas}
            keyExtractor={(m) => m.id.toString()}
            renderItem={renderMascota}
            contentContainerStyle={{
              padding: isSmall ? 12 : isTablet ? 16 : 20,
              paddingBottom: 40,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },

  cardMascota: {
    padding: 14,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 14,
  },

  nombreMascota: {
    fontSize: 18,
    fontWeight: "bold",
  },

  subtitulo: {
    fontSize: 14,
    marginTop: 4,
  },

  cardSolicitud: {
    marginTop: 10,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },

  textoSolicitud: {
    fontSize: 15,
    fontWeight: "bold",
  },

  estadoSolicitud: {
    marginTop: 2,
    fontSize: 14,
  },

  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
  },
});
