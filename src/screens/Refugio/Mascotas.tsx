import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

export default function MascotasScreen({ navigation }: any) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Panel de Mascotas</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
        onPress={() => navigation.navigate("MisMascotas")}
      >
        <Text style={[styles.buttonText, {color:theme.colors.textSecondary}]}>Mis Mascotas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
        onPress={() => navigation.navigate("AgregarMascota")}
      >
        <Text style={[styles.buttonText, {color:theme.colors.textSecondary}]}>Agregar Mascota</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
        onPress={() => navigation.navigate("BorrarMascota")}
      >
        <Text style={[styles.buttonText, {color:theme.colors.textSecondary}]}>Borrar Mascota</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
        onPress={() => navigation.navigate("EditarMascota")}
      >
        <Text style={[styles.buttonText, {color:theme.colors.textSecondary}]}>Editar Mascota</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
