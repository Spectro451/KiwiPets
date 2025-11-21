import { useState, useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  Text,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";     // ← Corrección importante
import PetCard from "./PetCard";                     // ← Ruta correcta
import { Mascota } from "../types/mascota";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

type Props = {
  pets?: Mascota[];
  mascota?: Mascota;
  onSwipeEnd?: (dir: "left" | "right", petId: number) => void;
  onIndexChange?: (index: number) => void;
  onToggleFavorito?: () => void;
};

const PetSwipe = forwardRef((props: Props, ref) => {
  const { pets, mascota, onSwipeEnd, onIndexChange, onToggleFavorito } = props;
  const { theme } = useTheme();

  /* -----------------------------------------------------------
     MODO FAVORITOS (sin swipe)
  ------------------------------------------------------------ */
  if (mascota && onToggleFavorito) {
    return (
      <View style={styles.favoriteWrapper}>
        <TouchableOpacity
          style={[styles.favoriteBtn, { backgroundColor: theme.colors.error }]}
          onPress={onToggleFavorito}
        >
          <Text style={styles.favoriteText}>Quitar de favoritos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* -----------------------------------------------------------
     MODO SWIPE (Tinder)
  ------------------------------------------------------------ */
  if (!pets || pets.length === 0) return <View />;

  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const rotation = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-20deg", "0deg", "20deg"],
  });

  useEffect(() => {
    setIndex(0);
    position.setValue({ x: 0, y: 0 });
  }, [pets]);

  const animateSwipe = (dir: "left" | "right") => {
    const currentPet = pets[index];
    if (!currentPet) return;

    Animated.timing(position, {
      toValue: { x: dir === "right" ? width : -width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });

      const next = index + 1 < pets.length ? index + 1 : 0;
      setIndex(next);
      onIndexChange?.(next);
      onSwipeEnd?.(dir, currentPet.id_mascota);
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderMove: (_, g) => {
      position.setValue({ x: g.dx, y: 0 });
    },
    onPanResponderRelease: (_, g) => {
      if (g.dx > SWIPE_THRESHOLD) animateSwipe("right");
      else if (g.dx < -SWIPE_THRESHOLD) animateSwipe("left");
      else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  useImperativeHandle(ref, () => ({
    triggerSwipe: animateSwipe,
    getCurrentIndex: () => index,
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateX: position.x }, { rotate: rotation }],
          width: "100%",
        }}
        {...panResponder.panHandlers}
      >
        <PetCard mascota={pets[index]} width={260} />
      </Animated.View>
    </View>
  );
});

export default PetSwipe;

/* -----------------------------------------------------------
   Styles
------------------------------------------------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
  },

  favoriteWrapper: {
    marginTop: 10,
    alignItems: "center",
  },

  favoriteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  favoriteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
