import { useState } from "react";
import { View, StyleSheet, Dimensions, Text, PanResponder, Animated } from "react-native";
import PetCard, { Pet } from "./PetCard";

const { width } = Dimensions.get("window");

type SwipeCardsProps = {
  pets: Pet[];
};

export default function SwipeCardsSimple({ pets }: SwipeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const position = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
onPanResponderRelease: (_, gesture) => {
  const threshold = width * 0.25;

  if (gesture.dx > threshold) {
    // Swipe derecha
    Animated.timing(position, {
      toValue: { x: width, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex((prev) => (prev + 1 < pets.length ? prev + 1 : 0));
      console.log("Swipe RIGHT → acción aquí");
    });
  } else if (gesture.dx < -threshold) {
    // Swipe izquierda
    Animated.timing(position, {
      toValue: { x: -width, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex((prev) => (prev + 1 < pets.length ? prev + 1 : 0));
      console.log("Swipe LEFT → acción aquí");
    });
  } else {
    // No superó threshold → vuelve a su lugar
    Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
  }
},
  });

  if (!pets.length) return <Text>No hay mascotas disponibles.</Text>;

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[position.getLayout(), { width: "100%" }]}
      >
        <PetCard pet={pets[currentIndex]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    userSelect:"none",
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
    textAlign: "center",
  },
});
