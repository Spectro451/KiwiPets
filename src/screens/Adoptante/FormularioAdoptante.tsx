import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { createAdopcion } from "../../services/fetchAdopcion";


export default function FormularioAdoptante({ navigation, route }: any) {
  const { id_mascota } = route.params;
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isSmall = width < 600;

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.nombre.trim()) return "Nombre requerido";
    if (!form.telefono.trim()) return "Teléfono requerido";
    if (!form.direccion.trim()) return "Dirección requerida";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await createAdopcion(id_mascota);
      navigation.goBack();
    } catch (e) {
      console.error("Error al enviar solicitud:", e);
      setError("No se pudo enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "bottom"]}
    >
      <ScrollView contentContainerStyle={{ padding: isSmall ? 14 : 22 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Formulario de Adopción
          </Text>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 22, color: theme.colors.text }}>←</Text>
          </TouchableOpacity>
        </View>

        {/* NOMBRE */}
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Nombre Completo
        </Text>
        <TextInput
          value={form.nombre}
          onChangeText={(t) => setForm({ ...form, nombre: t })}
          placeholder="Tu nombre"
          placeholderTextColor={theme.colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
        />

        {/* TELÉFONO */}
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Teléfono
        </Text>
        <TextInput
          value={form.telefono}
          onChangeText={(t) => setForm({ ...form, telefono: t })}
          keyboardType="phone-pad"
          placeholder="+569XXXXXXX"
          placeholderTextColor={theme.colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
        />

        {/* DIRECCIÓN */}
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Dirección
        </Text>
        <TextInput
          value={form.direccion}
          onChangeText={(t) => setForm({ ...form, direccion: t })}
          placeholder="Calle, número, comuna"
          placeholderTextColor={theme.colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
        />

        {/* ERROR */}
        {error && (
          <Text
            style={{
              color: theme.colors.error,
              marginBottom: 10,
              marginTop: 4,
            }}
          >
            {error}
          </Text>
        )}

        {/* BOTÓN */}
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: loading ? theme.colors.errorDeshabilitado : theme.colors.accent,
            },
          ]}
          disabled={loading}
          onPress={handleSubmit}
        >
          <Text style={styles.btnText}>
            {loading ? "Procesando..." : "Enviar Solicitud"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  label: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 15,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
  },

  btn: {
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 22,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
