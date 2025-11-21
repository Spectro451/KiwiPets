import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

export default function MascotasScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingHorizontal: isSmallScreen ? 20 : 40 },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Panel de Mascotas</Text>

      <View style={{ width: isSmallScreen ? "100%" : 400 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
          onPress={() => navigation.navigate("MisMascotas")}
        >
          <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>
            Mis Mascotas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
          onPress={() => navigation.navigate("AgregarMascota")}
        >
          <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>
            Agregar Mascota
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
          onPress={() => navigation.navigate("BorrarMascota")}
        >
          <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>
            Borrar Mascota
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
          onPress={() => navigation.navigate("EditarMascota")}
        >
          <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>
            Editar Mascota
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
          onPress={() => navigation.navigate("TransferirMascotas")}
        >
          <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>
            Transferir Mascotas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 35,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
