import { useState, useImperativeHandle, forwardRef } from "react";
import { View, StyleSheet, Dimensions, Text, PanResponder, Animated } from "react-native";
import PetCard from "./PetCard";
import { Mascota } from "../types/mascota";

const { width } = Dimensions.get("window");

type SwipeCardsProps = {
  pets: Mascota[];
};

// Usamos forwardRef para exponer la función
const PetSwipe = forwardRef(({ pets }: SwipeCardsProps, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = new Animated.ValueXY();

  const triggerSwipe = (dir: "left" | "right") => {
    if (!pets.length) return;

    const targetX = dir === "right" ? width : -width;

    Animated.timing(position, {
      toValue: { x: targetX, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex(prev => (prev + 1 < pets.length ? prev + 1 : 0));
      console.log(`Swipe ${dir.toUpperCase()} → acción aquí`);
    });
  };

  // Exponemos la función al ref
  useImperativeHandle(ref, () => ({
    triggerSwipe
  }));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      const threshold = width * 0.25;

      if (gesture.dx > threshold) triggerSwipe("right");
      else if (gesture.dx < -threshold) triggerSwipe("left");
      else Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View {...panResponder.panHandlers} style={[position.getLayout(), { width: "100%" }]}>
        <PetCard pet={pets[currentIndex]} />
      </Animated.View>
    </View>
  );
});

export default PetSwipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
    textAlign: "center",
  },
});
