import { useCallback, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../theme/ThemeContext";

import { getMascotasCercanas } from "../../services/fetchMascotas";
import { createAdopcion } from "../../services/fetchAdopcion";
import {
  createFavorito,
  deleteFavorito,
  getFavorito,
} from "../../services/fetchFavoritos";
import { adoptanteByUsuarioId } from "../../services/fetchAdoptante";

import PetSwipe from "../../components/petSwipe";
import SkeletonCard from "../../components/skeletonCard";
import { useAuth } from "../../hooks/useAuth";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  const isSmall = width <= 480;
  const isTablet = width > 480 && width <= 840;
  const CONTENT_WIDTH = isSmall ? "100%" : isTablet ? 500 : 600;

  const [pets, setPets] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sinResultados, setSinResultados] = useState(false);

  const swipeRef = useRef<any>(null);
  const [indexActual, setIndexActual] = useState(0);

  const [radioBusqueda, setRadioBusqueda] = useState(5);
  const [vistas, setVistas] = useState<number[]>([]);
  const [bloqueado, setBloqueado] = useState(false);

  // ======================================================
  // Fetch
  // ======================================================
  const fetchMascotas = async (
    radio: number,
    vistasLocales: number[] = vistas
  ) => {
    setLoading(true);

    try {
      const data = await getMascotasCercanas(radio);
      const disponibles = data.filter(
        (m: any) => m.estado_adopcion !== "Adoptado"
      );
      const filtradas = disponibles.filter(
        (m: any) => !vistasLocales.includes(m.id_mascota)
      );

      setPets(filtradas);
      setSinResultados(filtradas.length === 0);

      const favs = await getFavorito();
      setFavoritos(
        favs.filter((f: any) => f.adoptante?.usuario.id === user?.id)
      );

      setIndexActual(0);
    } catch {
      console.log("Error fetchMascotas");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const cargar = async () => {
        try {
          const adopt = await adoptanteByUsuarioId();
          const radio = adopt?.radio_busqueda ?? 5;
          setRadioBusqueda(radio);
          fetchMascotas(radio);
        } catch {
          fetchMascotas(5);
        }
      };

      cargar();
    }, [user])
  );

  // ======================================================
  // Favorito
  // ======================================================
  const toggleFavorito = async (petId: number) => {
    if (bloqueado) return;
    setBloqueado(true);

    const existe = favoritos.find((f: any) => f.mascota.id_mascota === petId);

    if (existe) {
      await deleteFavorito(existe.id);
      setFavoritos((prev) =>
        prev.filter((f) => f.mascota.id_mascota !== petId)
      );
    } else {
      const nuevo = await createFavorito(petId);
      if (nuevo) setFavoritos((prev) => [nuevo, ...prev]);
    }

    setTimeout(() => setBloqueado(false), 300);
  };

  // ======================================================
  // Swipe manual
  // ======================================================
  const ejecutarSwipe = (dir: "left" | "right") => {
    if (bloqueado) return;
    setBloqueado(true);

    swipeRef.current?.triggerSwipe(dir);

    setTimeout(() => setBloqueado(false), 300);
  };

  // ======================================================
  // Loading
  // ======================================================
  if (loading) {
    return (
      <View
        style={[
          styles.fullCenter,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <SkeletonCard />
        <View style={styles.buttons}>
          {[...Array(2)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.btnBottom,
                {
                  backgroundColor: theme.colors.backgroundTertiary,
                  opacity: 0.5,
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  }

  // ======================================================
  // Sin resultados
  // ======================================================
  if (sinResultados) {
    return (
      <View
        style={[
          styles.fullCenter,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>
          No se encontraron mascotas en tu radio de {radioBusqueda} km
        </Text>

        {radioBusqueda < 40 && (
          <TouchableOpacity
            onPress={() => {
              const nuevo = radioBusqueda + 5;
              setRadioBusqueda(nuevo);
              fetchMascotas(nuevo);
            }}
            style={[
              styles.btnAumentar,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Aumentar radio a {radioBusqueda + 5} km
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!pets.length) {
    return (
      <View
        style={[
          styles.fullCenter,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>
          No hay mascotas disponibles.
        </Text>
      </View>
    );
  }

  // ======================================================
  // UI principal
  // ======================================================
  return (
    <View style={[styles.main, { backgroundColor: theme.colors.background }]}>
      <View style={{ width: CONTENT_WIDTH, alignItems: "center", flex: 1 }}>
        <PetSwipe
          ref={swipeRef}
          pets={pets}
          onIndexChange={setIndexActual}
          onSwipeEnd={async (dir, petId) => {
            if (dir === "right") await createAdopcion(petId);

            const nuevas = vistas.includes(petId) ? vistas : [...vistas, petId];
            setVistas(nuevas);

            fetchMascotas(radioBusqueda, nuevas);
          }}
          onToggleFavorito={toggleFavorito}
          isFavorite={(petId) =>
            favoritos.some((f: any) => f.mascota.id_mascota === petId)
          }
        />
      </View>

      <View style={[styles.buttons, { width: CONTENT_WIDTH }]}>
        <TouchableOpacity
          style={[
            styles.btnBottom,
            { backgroundColor: theme.colors.backgroundTertiary },
          ]}
          onPress={() => ejecutarSwipe("left")}
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "700" }}>
            Siguiente
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnBottom,
            { backgroundColor: theme.colors.backgroundTertiary },
          ]}
          onPress={() => ejecutarSwipe("right")}
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "700" }}>
            Like
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ======================================================
// Styles fijos (SEGUROS)
// ======================================================
const styles = StyleSheet.create({
  fullCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  btnAumentar: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },

  btnBottom: {
    width: 90,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
