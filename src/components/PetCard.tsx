import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons"; // ← REEMPLAZO CORRECTO

interface Props {
  mascota: any;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  width?: number;
}

export default function PetCard({
  mascota,
  onPress,
  onToggleFavorite,
  isFavorite,
  width,
}: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width: width || 180,
          backgroundColor: theme.colors.backgroundSecondary,
          borderColor: theme.colors.backgroundTertiary,
          shadowColor: "#000",
        },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={
            mascota.foto
              ? { uri: mascota.foto }
              : { uri: "https://via.placeholder.com/500x500?text=Sin+Foto" }
          }
          style={styles.image}
        />

        <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"} // ← ÍCONO EXISTENTE
            size={22}
            color={isFavorite ? "#EF5350" : theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
          {mascota.nombre}
        </Text>

        <Text style={[styles.sub, { color: theme.colors.text }]}>
          {mascota.edad ? `${mascota.edad} años` : "Edad desconocida"}
        </Text>

        <Text style={[styles.sub, { color: theme.colors.text }]}>
          {mascota.especie || "Sin especie"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    ...Platform.select({
      web: {
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 20,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    opacity: 0.75,
  },
});
