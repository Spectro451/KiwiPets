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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

const handleSwipe = (dir: "left" | "right") => {
  if (isButtonDisabled) return;

  setIsButtonDisabled(true);

  requestAnimationFrame(() => {
    swipeRef.current?.triggerSwipe(dir);

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 400);
  });
};

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
      <PetSwipe ref={swipeRef} pets={pets} />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isButtonDisabled ? theme.colors.backgroundSecondary : theme.colors.backgroundTertiary },
          ]}
          onPress={() => handleSwipe("left")}
          disabled={isButtonDisabled}
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Siguiente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isButtonDisabled ? theme.colors.backgroundSecondary : theme.colors.backgroundTertiary },
          ]}
          onPress={() => console.log("Favorito")}
          disabled={isButtonDisabled}
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Favorito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isButtonDisabled ? theme.colors.backgroundSecondary : theme.colors.backgroundTertiary },
          ]}
          onPress={() => handleSwipe("right")}
          disabled={isButtonDisabled}
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
