import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator } from "react-native";
import { adoptanteByUsuarioId, updateAdoptante } from "../services/fetchAdoptante";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FormularioAdoptanteProps = {
  navigation: any;
  route: any;
  setRedirect: (val: string | null) => void;
};

export default function FormularioAdoptante({ navigation, route, setRedirect }: FormularioAdoptanteProps) {
  const [refugioId, setAdoptanteId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAdoptante = async () => {
      setLoading(true);
      try {
        // Solo llamamos a tu servicio ya existente
        const data = await adoptanteByUsuarioId();
        if (!data) throw new Error("No se encontró refugio");

        setAdoptanteId(data.id);
        setNombre(data.nombre);
        setDireccion(data.direccion);
        setTelefono(data.telefono);
      } catch (err: any) {
        setError(err.message || "Error al cargar datos del refugio");
      } finally {
        setLoading(false);
      }
    };

    loadAdoptante();
  }, []);

  const handleSave = async () => {
    if (!refugioId) return;
    setSaving(true);
    setError(null);
    try {
      await updateAdoptante(refugioId, { nombre, direccion, telefono });
      setRedirect(null); // <--- Esto hará que App.tsx renderice BottomTabs
    } catch {
      setError("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="blue" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Nombre:</Text>
      <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre del refugio" style={{ borderWidth: 1, borderColor: "gray", padding: 8, borderRadius: 4, marginBottom: 10 }} />

      <Text>Dirección:</Text>
      <TextInput value={direccion} onChangeText={setDireccion} placeholder="Dirección" style={{ borderWidth: 1, borderColor: "gray", padding: 8, borderRadius: 4, marginBottom: 10 }} />

      <Text>Teléfono:</Text>
      <TextInput value={telefono} onChangeText={setTelefono} placeholder="Teléfono" keyboardType="phone-pad" style={{ borderWidth: 1, borderColor: "gray", padding: 8, borderRadius: 4, marginBottom: 10 }} />

      {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}

      <Button title={saving ? "Guardando..." : "Guardar"} onPress={handleSave} disabled={saving} />
    </View>
  );
}
