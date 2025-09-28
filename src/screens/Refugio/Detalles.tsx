import { View, Text } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

type RouteParams = {
  DetalleAdopcion: { id: number };
};

export default function DetalleAdopcion() {
  const route = useRoute<RouteProp<RouteParams, "DetalleAdopcion">>();
  const { id } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Detalles funciona</Text>
      <Text>ID de adopción: {id}</Text>
    </View>
  );
}
