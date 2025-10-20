import { useEffect, useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Dimensions, Platform, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import { updateAdoptante } from "../../services/fetchAdoptante";
import { useTheme } from "../../theme/ThemeContext";
import { Edad, EspeciePreferida, Sexo, Vivienda } from "../../types/enums";
import { Picker } from '@react-native-picker/picker';
import { Adoptante } from "../../types/adoptante";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  EditarAdoptante: { perfilData: Adoptante };
};

type EditarAdoptanteRouteProp = RouteProp<RootStackParamList, "EditarAdoptante">;

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const FORM_CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 400);

export default function EditarAdoptante() {
  const navigation = useNavigation();
  const route = useRoute<EditarAdoptanteRouteProp>();
  const { perfilData } = route.params;
  const { theme } = useTheme();

  const [nombre, setNombre] = useState(perfilData.nombre);
  const [rut, setRut] = useState(perfilData.rut);
  const [rutOriginal] = useState(perfilData.rut);
  const [direccion, setDireccion] = useState(perfilData.direccion);
  const [telefono, setTelefono] = useState(perfilData.telefono);
  const [edad, setEdad] = useState(perfilData.edad);
  const [experienciaMascotas, setExperienciaMascotas] = useState<"Si" | "No">(
    perfilData.experiencia_mascotas === "Si" ? "Si" : "No"
  );
  const [cantidadMascotas, setCantidadMascotas] = useState(perfilData.cantidad_mascotas);
  const [especiePreferida, setEspeciePreferida] = useState<EspeciePreferida>(perfilData.especie_preferida);
  const [tipoVivienda, setTipoVivienda] = useState<Vivienda>(perfilData.tipo_vivienda);
  const [sexo, setSexo] = useState<Sexo>(perfilData.sexo);
  const [edadBuscada, setEdadBuscada] = useState<Edad>(perfilData.edad_buscada);
  const [motivoAdopcion, setMotivoAdopcion] = useState(perfilData.motivo_adopcion);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }
    const rutRegex = /^\d{7,8}[0-9kK]$/;
    if (!rutRegex.test(rut)) {
      setError("Rut invalido");
      return;
    }
    const telefonoRegex = /^\+\d{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      setError("Debes incluir prefijo nacional y sin espacios");
      return;
    }
    if (edad < 18 || edad > 100) {
      setError("Debes ser mayor de 18");
      return;
    }
    if (cantidadMascotas < 0 || cantidadMascotas > 20) {
      setError("Cantidad de mascotas debe estar entre 0 y 20");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateAdoptante(rutOriginal, {
        rut,
        nombre,
        edad,
        telefono,
        direccion,
        experiencia_mascotas: experienciaMascotas,
        cantidad_mascotas: experienciaMascotas === "Si" ? cantidadMascotas : 0,
        especie_preferida: especiePreferida,
        tipo_vivienda: tipoVivienda,
        sexo,
        edad_buscada: edadBuscada,
        motivo_adopcion: motivoAdopcion,
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
      <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }}>
        <View style={{
          width: FORM_CARD_WIDTH,
          backgroundColor: theme.colors.backgroundSecondary,
          padding: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: theme.colors.accent,
        }}>
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Rut:</Text>
          <TextInput
            value={rut ?? ""} 
            onChangeText={t => {
            const soloNumeros = t.replace(/[^0-9kK]/g, '');
            setRut(soloNumeros);
            }}
            placeholder="rut sin punto ni guion" 
            style={[styles.input, { color: theme.colors.text }]} 
            placeholderTextColor={theme.colors.text} 
          />
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Nombre:</Text>
          <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre del adoptante" style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

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
            style={[styles.input, { color: theme.colors.text }]} 
            placeholderTextColor={theme.colors.text} 
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Edad:</Text>
          <TextInput 
            value={edad.toString()} 
            onChangeText={t => {
              const soloNumeros = t.replace(/[^0-9]/g, ""); // elimina letras
              setEdad(soloNumeros ? Number(soloNumeros) : 0);
            }}
            placeholder="Edad" 
            keyboardType="number-pad" 
            style={[styles.input, { color: theme.colors.text }]} 
            placeholderTextColor={theme.colors.text} 
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>¿Tienes experiencia con mascotas?</Text>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {["Si", "No"].map(opcion => (
              <TouchableOpacity
                key={opcion}
                onPress={() => setExperienciaMascotas(opcion as "Si" | "No")}
                style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: theme.colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {experienciaMascotas === opcion && (
                    <View style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: theme.colors.secondary,
                    }} />
                  )}
                </View>
                <Text style={{ marginLeft: 6, color: theme.colors.secondary }}>{opcion}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {experienciaMascotas === "Si" && (
            <>
              <Text style={[styles.label, { color: theme.colors.secondary }]}>Cuántas mascotas tiene:</Text>
              <TextInput
                value={cantidadMascotas.toString()}
                onChangeText={t => {
                  const soloNumeros = t.replace(/[^0-9]/g, ""); // elimina letras
                  setCantidadMascotas(soloNumeros ? Number(soloNumeros) : 0);
                }}
                placeholder="Cantidad"
                keyboardType="number-pad"
                style={[styles.input, { color: theme.colors.text }]}
                placeholderTextColor={theme.colors.text}
              />
            </>
          )}

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Especie preferida:</Text>
          <Picker selectedValue={especiePreferida} onValueChange={setEspeciePreferida} style={[styles.input, { color: theme.colors.text, backgroundColor:theme.colors.backgroundSecondary }]}>
            {Object.values(EspeciePreferida).map(e => <Picker.Item key={e} label={e} value={e} />)}
          </Picker>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Tipo de vivienda:</Text>
          <Picker selectedValue={tipoVivienda} onValueChange={setTipoVivienda} style={[styles.input, { color: theme.colors.text, backgroundColor:theme.colors.backgroundSecondary }]}>
            {Object.values(Vivienda).map(v => <Picker.Item key={v} label={v} value={v} />)}
          </Picker>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Sexo:</Text>
          <Picker selectedValue={sexo} onValueChange={setSexo} style={[styles.input, { color: theme.colors.text, backgroundColor:theme.colors.backgroundSecondary }]}>
            {Object.values(Sexo).map(s => <Picker.Item key={s} label={s} value={s} />)}
          </Picker>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Edad buscada:</Text>
          <Picker selectedValue={edadBuscada} onValueChange={setEdadBuscada} style={[styles.input, { color: theme.colors.text, backgroundColor:theme.colors.backgroundSecondary }]}>
            {Object.values(Edad).map(e => <Picker.Item key={e} label={e} value={e} />)}
          </Picker>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Motivo de adopción:</Text>
          <TextInput value={motivoAdopcion} onChangeText={setMotivoAdopcion} placeholder="Me gustaria adoptar porque..." style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} multiline numberOfLines={3} />

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
