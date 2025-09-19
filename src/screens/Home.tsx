import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../theme/ThemeContext";
import { useCallback, useState, useRef } from "react";
import { getMascotas } from "../services/api";
import SwipeCardsSimple from "../components/SwipeCards"; // Asegúrate de usar la versión con forwardRef

export default function HomeScreen() {
  const { theme } = useTheme();
  const [pets, setPets] = useState([]);
  const swipeRef = useRef<{ triggerSwipe: (dir: "left" | "right") => void }>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchPets = async () => {
        try {
          const data = await getMascotas();
          setPets(data);
        } catch (error) {
          console.error("Error al obtener mascotas:", error);
        }
      };
      fetchPets();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Renderizamos SwipeCards una sola vez y pasamos el ref */}
      <SwipeCardsSimple ref={swipeRef} pets={pets} />

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
