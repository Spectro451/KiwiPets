import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Platform, Dimensions } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const CARD_WIDTH = Dimensions.get("window").width * 0.85;

interface Props {
  width?: number;
}

export default function SkeletonPetCard({ width }: Props) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const skeletonColor = theme.colors.backgroundTertiary;
  const cardWidth = width || CARD_WIDTH;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            width: cardWidth,
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.backgroundTertiary,
            shadowColor: "#000",
            opacity,
          },
        ]}
      >
        {/* Image placeholder - igual que en PetCard */}
        <View style={styles.imageWrapper}>
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: skeletonColor },
            ]}
          />

          {/* Favorite button placeholder */}
          <View style={styles.favoriteButtonPlaceholder}>
            <View
              style={[
                styles.heartPlaceholder,
                { backgroundColor: skeletonColor },
              ]}
            />
          </View>
        </View>

        {/* Info section */}
        <View style={styles.info}>
          {/* Nombre */}
          <View
            style={[styles.namePlaceholder, { backgroundColor: skeletonColor }]}
          />

          {/* Edad */}
          <View style={styles.fieldContainer}>
            <View
              style={[
                styles.titlePlaceholder,
                { backgroundColor: skeletonColor },
              ]}
            />
            <View
              style={[
                styles.subPlaceholder,
                { backgroundColor: skeletonColor },
              ]}
            />
          </View>

          {/* Especie */}
          <View style={styles.fieldContainer}>
            <View
              style={[
                styles.titlePlaceholder,
                { backgroundColor: skeletonColor },
              ]}
            />
            <View
              style={[
                styles.subPlaceholder,
                { backgroundColor: skeletonColor },
              ]}
            />
          </View>

          {/* Género */}
          <View style={styles.fieldContainer}>
            <View
              style={[
                styles.titlePlaceholder,
                { backgroundColor: skeletonColor },
              ]}
            />
            <View
              style={[
                styles.subPlaceholder,
                { backgroundColor: skeletonColor },
              ]}
            />
          </View>

          {/* Descripción */}
          <View style={styles.fieldContainer}>
            <View
              style={[
                styles.titlePlaceholder,
                { backgroundColor: skeletonColor },
              ]}
            />
            <View
              style={[
                styles.descPlaceholder,
                { backgroundColor: skeletonColor },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Esto hará que ocupe el espacio disponible
    justifyContent: "center",
    alignItems: "center",
  },
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
  imagePlaceholder: {
    width: "100%",
    height: "100%",
  },
  favoriteButtonPlaceholder: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    borderRadius: 20,
  },
  heartPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  info: {
    padding: 10,
  },
  namePlaceholder: {
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
    width: "70%",
  },
  fieldContainer: {
    marginTop: 8,
  },
  titlePlaceholder: {
    height: 16,
    borderRadius: 4,
    width: 80,
    marginBottom: 2,
  },
  subPlaceholder: {
    height: 14,
    borderRadius: 4,
    width: "60%",
    opacity: 0.75,
  },
  descPlaceholder: {
    height: 14,
    borderRadius: 4,
    width: "100%",
    marginTop: 2,
    opacity: 0.75,
  },
});
