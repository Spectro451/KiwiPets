import { useEffect, useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Dimensions, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { adoptanteByUsuarioId, updateAdoptante } from "../../services/fetchAdoptante";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../theme/ThemeContext";
import { Edad, EspeciePreferida, Sexo, Vivienda } from "../../types/enums";
import { Picker } from '@react-native-picker/picker';

type FormularioAdoptanteProps = {
  setRedirect: (val: string | null) => void;
};

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const FORM_CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 400);

export default function FormularioAdoptante({ setRedirect }: FormularioAdoptanteProps) {
  const [rutActual, setRutActual] = useState<string | null>(null); // el del url
  const [adoptanteRut, setAdoptanteRut] = useState<string | null>(null); // el pa editar
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [edad, setEdad] = useState<number>(0);
  const [experienciaMascotas, setExperienciaMascotas] = useState<"Si" | "No">("No");
  const [cantidadMascotas, setCantidadMascotas] = useState<number>(0);
  const [especiePreferida, setEspeciePreferida] = useState<EspeciePreferida>(EspeciePreferida.CUALQUIERA);
  const [tipoVivienda, setTipoVivienda] = useState<Vivienda>(Vivienda.CASA_PATIO);
  const [sexo, setSexo] = useState<Sexo>(Sexo.CUALQUIERA);
  const [edadBuscada, setEdadBuscada] = useState<Edad>(Edad.CACHORRO);
  const [motivoAdopcion, setMotivoAdopcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const loadAdoptante = async () => {
      setLoading(true);
      try {
        //se busca el adoptante en base a la id del tokenssss
        const data = await adoptanteByUsuarioId();
        if (!data) throw new Error("No se encontró adoptante");
        setRutActual(data.rut);
      } catch (err: any) {
        setError(err.message || "Error al cargar datos del adoptante");
      } finally {
        setLoading(false);
      }
    };

    loadAdoptante();
  }, []);

  const handleSave = async () => {
    if (!adoptanteRut) return;
    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }
    const telefonoRegex = /^\+\d{7,15}$/;
    if (!telefonoRegex.test(telefono)) {
      setError("Debes incluir prefijo nacional y sin espacios");
      return;
    }
    if(edad <18){
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
      await updateAdoptante(rutActual!, {
        rut:adoptanteRut,
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
      //Borro el flag
      await AsyncStorage.removeItem("goToFormulario");

      //ahora si pal home
      setRedirect(null);
    } catch {
      setError("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={theme.colors.secondary} style={{ flex: 1, backgroundColor:theme.colors.background }} />;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
      <View style={{
        width: FORM_CARD_WIDTH,
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.accent,
      }}>
        <Text style={[styles.label, { color: theme.colors.secondary }]}>Rut:</Text>
        <TextInput value={adoptanteRut ?? ""} onChangeText={setAdoptanteRut} placeholder="rut sin punto ni guion" style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Nombre:</Text>
        <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre del adoptante" style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Dirección:</Text>
        <TextInput value={direccion} onChangeText={setDireccion} placeholder="Dirección" style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Teléfono:</Text>
        <TextInput value={telefono} onChangeText={setTelefono} placeholder="+56912345678" keyboardType="phone-pad" style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Edad:</Text>
        <TextInput value={edad.toString()} onChangeText={t => setEdad(Number(t))} placeholder="Edad" keyboardType="number-pad" style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

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
                  }}/>
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
              onChangeText={t => setCantidadMascotas(Number(t))}
              placeholder="Cantidad"
              keyboardType="number-pad"
              style={[styles.input, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.text}
            />
          </>
        )}

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Especie preferida:</Text>
        <Picker selectedValue={especiePreferida} onValueChange={(v) => setEspeciePreferida(v)} style={[styles.input, { color: theme.colors.primary }]}>
          {Object.values(EspeciePreferida).map(e => <Picker.Item key={e} label={e} value={e} />)}
        </Picker>

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Tipo de vivienda:</Text>
        <Picker selectedValue={tipoVivienda} onValueChange={(v) => setTipoVivienda(v)} style={[styles.input, { color: theme.colors.primary }]}>
          {Object.values(Vivienda).map(v => <Picker.Item key={v} label={v} value={v} />)}
        </Picker>

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Sexo:</Text>
        <Picker selectedValue={sexo} onValueChange={(v) => setSexo(v)} style={[styles.input, { color: theme.colors.primary }]}>
          {Object.values(Sexo).map(s => <Picker.Item key={s} label={s} value={s} />)}
        </Picker>

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Edad buscada:</Text>
        <Picker selectedValue={edadBuscada} onValueChange={(v) => setEdadBuscada(v)} style={[styles.input, { color: theme.colors.primary }]}>
          {Object.values(Edad).map(e => <Picker.Item key={e} label={e} value={e} color={theme.colors.text} />)}
        </Picker>

        <Text style={[styles.label, { color: theme.colors.secondary }]}>Motivo de adopción:</Text>
        <TextInput value={motivoAdopcion} onChangeText={setMotivoAdopcion} placeholder="Me gustaria adoptar porque..." style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} multiline numberOfLines={3} />

        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]} onPress={handleSave} disabled={saving}>
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>{saving ? "Guardando..." : "Guardar"}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
