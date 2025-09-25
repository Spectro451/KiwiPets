import { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Platform, Animated } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const { width, height } = Dimensions.get("window");

const isWeb = Platform.OS === "web";
const CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 480);
const CARD_HEIGHT = isWeb ? CARD_WIDTH * 1.6 : CARD_WIDTH * 1.7;

export default function SkeletonCard() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  const { theme } = useTheme();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedStyle = { opacity: pulseAnim };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <View style={[styles.imageContainer]}>
          {/* Imagen */}
          <Animated.View
            style={[styles.image, animatedStyle, { backgroundColor: theme.colors.backgroundSecondary }]}
          />
          {/* Overlay */}
          <Animated.View
            style={[
              styles.Overlay,
              animatedStyle,
              { backgroundColor: theme.colors.overlayBackground },
            ]}
          >
            {/* Simula nombre */}
            <Animated.View
              style={[
                { width: "60%", height: 28, borderRadius: 6, marginBottom: 4 },
                animatedStyle,
                { backgroundColor: theme.colors.backgroundTertiary },
              ]}
            />
            {/* Simula raza */}
            <Animated.View
              style={[
                { width: "40%", height: 20, borderRadius: 6 },
                animatedStyle,
                { backgroundColor: theme.colors.backgroundTertiary },
              ]}
            />
          </Animated.View>
        </View>
        {/* Stats */}
        <Animated.View
          style={[
            styles.statsContainer,
            animatedStyle,
            { backgroundColor: theme.colors.backgroundTertiary },
          ]}
        >
          {[...Array(4)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.stat,
                animatedStyle,
                { backgroundColor: theme.colors.backgroundSecondary },
              ]}
            />
          ))}
        </Animated.View>

        {/* Descripción */}
        <View style={styles.descripcion}>
          {[...Array(13)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                i % 4 === 2 ? styles.lineShort : styles.line,
                animatedStyle,
                { backgroundColor: theme.colors.backgroundTertiary },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    marginVertical: 10,
  },
  imageContainer: {
    width: "100%",
    height: "65%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  Overlay: {
    position: "absolute",
    bottom: 0,
    width: "30%",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  stat: {
    flex: 1,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  descripcion: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  line: {
    width: "75%",
    height: 14,
    borderRadius: 6,
    marginBottom: 6,
  },
  lineShort: {
    width: "55%",
    height: 14,
    borderRadius: 6,
    marginBottom: 6,
  },
});
