import { useState } from "react";
import { View, Text, TextInput, Dimensions, Platform, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator } from "react-native";
import { updateRefugio } from "../../services/fetchRefugio";
import { useTheme } from "../../theme/ThemeContext";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { buscarDirecciones, Direccion } from "../../services/mapBox";

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
  const [comuna, setComuna] = useState(perfilData.comuna ?? "");
  const [latitud, setLatitud] = useState<number | undefined>(perfilData.latitud);
  const [longitud, setLongitud] = useState<number | undefined>(perfilData.longitud);
  const [sugerenciasComuna, setSugerenciasComuna] = useState<Direccion[]>([]);
  const [loadingComuna, setLoadingComuna] = useState(false);
  const [comunaValida, setComunaValida] = useState<boolean>(!!perfilData.comuna);

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
    if (!comuna.trim()) {
      setError("Debes ingresar comuna");
      return;
    }

    if (!comunaValida) {
      setError("Debes seleccionar una comuna de la lista");
      setSaving(false);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateRefugio(perfilData.id, {
        nombre,
        direccion,
        telefono,
        comuna,
        latitud,
        longitud,
      });
      navigation.goBack();
    } catch {
      setError("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleComunaChange = async (text: string) => {
    setComuna(text);
    setComunaValida(false); // reset al escribir

    if (text.trim().length < 3) {
      setSugerenciasComuna([]);
      return;
    }

    setLoadingComuna(true);
    try {
      const results = await buscarDirecciones(text);
      setSugerenciasComuna(results);
    } catch (err) {
      console.error(err);
      setSugerenciasComuna([]);
    } finally {
      setLoadingComuna(false);
    }
  };

  const handleSelectComuna = (dir: Direccion) => {
    setComuna(dir.comuna);
    setLatitud(dir.latitud);
    setLongitud(dir.longitud);
    setSugerenciasComuna([]);
    setComunaValida(true);
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

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Comuna:</Text>
          <TextInput
            value={comuna}
            onChangeText={handleComunaChange}
            placeholder="Ingrese comuna"
            style={[styles.input, { color: theme.colors.text }]}
            placeholderTextColor={theme.colors.text}
          />

          {loadingComuna && <ActivityIndicator size="small" color={theme.colors.secondary} />}

          {sugerenciasComuna.length > 0 && (
            <View style={{
              borderWidth: 1,
              borderColor: theme.colors.accent,
              borderRadius: 6,
              maxHeight: 150,
              marginBottom: 10,
            }}>
              {sugerenciasComuna.slice(0, 3).map((dir, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectComuna(dir)}
                  style={{
                    padding: 8,
                    borderBottomWidth: index !== Math.min(sugerenciasComuna.length, 3) - 1 ? 1 : 0,
                    borderColor: theme.colors.accent,
                  }}
                >
                  <Text style={{ color: theme.colors.text }}>
                    {dir.comuna}{dir.ciudad ? `, ${dir.ciudad}` : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

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
