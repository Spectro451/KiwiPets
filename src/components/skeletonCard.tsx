import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Platform } from "react-native";
import { useTheme } from "../theme/ThemeContext";

interface Props {
  width?: number;
}

export default function SkeletonCard({ width = 180 }: Props) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: Platform.OS !== "web",
        }),
      ])
    ).start();
  }, []);

  // Color neutro siempre disponible en cualquier theme
  const baseColor = theme.colors.backgroundSecondary;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          width,
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          shadowColor: Platform.OS === "web" ? "transparent" : "#000",
          opacity,
        },
      ]}
    >
      <View
        style={[
          styles.imagePlaceholder,
          { backgroundColor: baseColor },
        ]}
      />

      <View style={styles.content}>
        <View
          style={[
            styles.textLine,
            { width: "60%", backgroundColor: baseColor },
          ]}
        />
        <View
          style={[
            styles.textLine,
            { width: "40%", backgroundColor: baseColor },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 3,
    ...Platform.select({
      web: {
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },

  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
  },

  content: {
    padding: 10,
    gap: 6,
  },

  textLine: {
    height: 12,
    borderRadius: 6,
  },
});
