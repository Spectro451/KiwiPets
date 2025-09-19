import { View, TouchableOpacity, Text, StyleSheet,  } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import SwipeCards from "../components/SwipeCards"; // Importa el componente nuevo
import { useTheme } from "../theme/ThemeContext";
import { useCallback, useEffect, useState } from "react";
import { getMascotas } from "../services/api";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [pets, setPets] = useState([]);
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
      <SwipeCards pets={pets} />
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
