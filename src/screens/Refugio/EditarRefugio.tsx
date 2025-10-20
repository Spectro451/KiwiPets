import { useState } from "react";
import { View, Text, TextInput, Dimensions, Platform, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import { updateRefugio } from "../../services/fetchRefugio";
import { useTheme } from "../../theme/ThemeContext";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  EditarRefugio: { perfilData: any };
};

type EditarRefugioRouteProp = RouteProp<RootStackParamList, "EditarRefugio">;

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const FORM_CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 400);

export default function EditarRefugio() {
  const navigation = useNavigation();
  const route = useRoute<EditarRefugioRouteProp>();
  const { perfilData } = route.params;
  const { theme } = useTheme();

  const [nombre, setNombre] = useState(perfilData.nombre);
  const [direccion, setDireccion] = useState(perfilData.direccion);
  const [telefono, setTelefono] = useState(perfilData.telefono);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }
    const telefonoRegex = /^\+\d{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      setError("Debes incluir prefijo nacional y sin espacios");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateRefugio(perfilData.id, {
        nombre,
        direccion,
        telefono,
      });
      navigation.goBack();
    } catch {
      setError("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <View style={{
          width: FORM_CARD_WIDTH,
          backgroundColor: theme.colors.backgroundSecondary,
          padding: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: theme.colors.accent,
        }}>
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Nombre:</Text>
          <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre del refugio" style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Dirección:</Text>
          <TextInput value={direccion} onChangeText={setDireccion} placeholder="Dirección" style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Teléfono:</Text>
          <TextInput 
            value={telefono} 
            onChangeText={t => {
              let filtrado = t.replace(/[^0-9+]/g, '');
              setTelefono(filtrado);
            }}
            placeholder="+56912345678" 
            keyboardType="phone-pad" 
            style={[styles.input, {color:theme.colors.text}]} 
            placeholderTextColor={theme.colors.text} 
          />

          {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.button, { flex: 1, backgroundColor: theme.colors.backgroundTertiary, marginRight: 5 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
                {saving ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { flex: 1, backgroundColor: theme.colors.error, marginLeft: 5 }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  error: {
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
