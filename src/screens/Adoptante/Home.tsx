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

// ======================================================
//  ESTILOS DINÁMICOS
// ======================================================

function emptyContainer(theme: any) {
  return {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.background,
  } as const;
}

function btnAumentar(theme: any) {
  return {
    marginTop: 10,
    backgroundColor: theme.colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  } as const;
}

function botonInferior(theme: any, disabled: boolean) {
  return {
    width: 90,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: disabled
      ? theme.colors.backgroundSecondary
      : theme.colors.backgroundTertiary,
  } as const;
}

function botonTexto(theme: any) {
  return {
    color: theme.colors.text,
    fontWeight: "700" as const,
  };
}

// ======================================================
//                HOME SCREEN FINAL
// ======================================================

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  // breakpoints unificados
  const isSmall = width <= 480;
  const isTablet = width > 480 && width <= 840;
  const isDesktop = width > 840;

  // ancho máximo del contenedor central
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
  // Principal
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
      setFavoritos(favs.filter((f: any) => f.adoptante?.usuario.id === user?.id));

      setIndexActual(0);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // Cargar en Focus
  // ======================================================
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
  // Toggle Favorito
  // ======================================================
  const toggleFavorito = async (petId: number) => {
    if (bloqueado) return;
    setBloqueado(true);

    const existe = favoritos.find(
      (f: any) => f.mascota.id_mascota === petId
    );

    if (existe) {
      await deleteFavorito(existe.id);
      setFavoritos((prev) =>
        prev.filter((f) => f.mascota.id_mascota !== petId)
      );
    } else {
      const nuevo = await createFavorito(petId);
      if (nuevo) setFavoritos((prev) => [nuevo, ...prev]);
    }

    setTimeout(() => setBloqueado(false), 400);
  };

  // ======================================================
  // Ejecutar Swipes Manuales
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
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <SkeletonCard />
        <View style={styles.buttonsLoading} />
      </View>
    );
  }

  // ======================================================
  // Sin Resultados
  // ======================================================
  if (sinResultados) {
    return (
      <View style={emptyContainer(theme)}>
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
            style={btnAumentar(theme)}
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
      <View style={emptyContainer(theme)}>
        <Text style={{ color: theme.colors.text }}>
          No hay mascotas disponibles.
        </Text>
      </View>
    );
  }

  // ======================================================
  // UI PRINCIPAL — versión final responsiva
  // ======================================================
 return (
  <View
    style={{
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: isSmall ? 10 : isTablet ? 20 : 40,
      paddingTop: isSmall ? 10 : 20,
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <View
      style={{
        width: CONTENT_WIDTH,
        alignSelf: "center",
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
      }}
    >
      <PetSwipe
        ref={swipeRef}
        pets={pets}
        onIndexChange={setIndexActual}
        onSwipeEnd={async (dir: "left" | "right", petId: number) => {
          if (dir === "right") await createAdopcion(petId);
          const nuevas = vistas.includes(petId) ? vistas : [...vistas, petId];
          setVistas(nuevas);
          fetchMascotas(radioBusqueda, nuevas);
        }}
        // aquí conectamos el corazón al mismo toggleFavorito
        onToggleFavorito={toggleFavorito}
        isFavorite={(petId) =>
          favoritos.some(
            (f: any) => f.mascota.id_mascota === petId
          )
        }
      />
    </View>

    <View
      style={[
        styles.buttons,
        { width: CONTENT_WIDTH, paddingHorizontal: isSmall ? 6 : 12 },
      ]}
    >
      <TouchableOpacity
        style={botonInferior(theme, bloqueado)}
        onPress={() => ejecutarSwipe("left")}
      >
        <Text style={botonTexto(theme)}>Siguiente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={botonInferior(theme, bloqueado)}
        onPress={() => toggleFavorito(pets[indexActual].id_mascota)}
      >
        <Text style={botonTexto(theme)}>
          {favoritos.some(
            (f: any) =>
              f.mascota.id_mascota === pets[indexActual].id_mascota
          )
            ? "❤️"
            : "Favorito"}
        </Text>
      </TouchableOpacity>

    </View>
  </View>
);

}

// ======================================================
//      STYLESHEET — NO SE MODIFICA
// ======================================================

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 12,
  },

  buttonsLoading: {
    width: "100%",
    height: 70,
    marginTop: 20,
  },
});