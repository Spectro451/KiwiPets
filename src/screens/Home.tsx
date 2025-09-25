import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../theme/ThemeContext";
import { useCallback, useState, useRef } from "react";
import { getMascotas } from "../services/fetchMascotas";
import PetSwipe from "../components/petSwipe";
import SkeletonCard from "../components/skeletonCard";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [pets, setPets] = useState([]);
  const swipeRef = useRef<{ triggerSwipe: (dir: "left" | "right") => void }>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchPets = async () => {
        setLoading(true)
        try {
          const data = await getMascotas();
          setPets(data);
        } catch (error) {
          console.error("Error al obtener mascotas:", error);
        } finally{
          setLoading(false)
        }
      };
      fetchPets();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <SkeletonCard />

        {/* Botones Skeleton */}
        <View style={styles.buttonsContainer}>
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.button,
                { backgroundColor: theme.colors.backgroundTertiary, opacity: 0.5 },
              ]}
            />
          ))}
        </View>
      </View>
    );
  }
  if (!pets.length) return <Text>No hay mascotas disponibles.</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Renderizamos petSwipe una sola vez y pasamos el ref */}
      <PetSwipe ref={swipeRef} pets={pets} />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]}
          onPress={() => swipeRef.current?.triggerSwipe("left")} // Siguiente → swipe izquierda
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Siguiente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]}
          onPress={() => console.log("poto")}>
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Favorito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]}
          onPress={() => swipeRef.current?.triggerSwipe("right")} // Like → swipe derecha
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 65,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    margin: 10,
  },
});
