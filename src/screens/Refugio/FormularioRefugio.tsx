import { useEffect, useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Dimensions, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { refugioByUsuarioId, updateRefugio } from "../../services/fetchRefugio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../theme/ThemeContext";
import { deleteUsuario } from "../../services/fetchUsuario";

type FormularioRefugioProps = {
  setRedirect: (val: string | null) => void;
  onCancel: () => void;
};

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const FORM_CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 400);

export default function FormularioRefugio({ setRedirect, onCancel }: FormularioRefugioProps) {
  const [refugioId, setRefugioId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const loadRefugio = async () => {
      setLoading(true);
      try {
        //se busca el refugio en base a la id del tokenssss
        const data = await refugioByUsuarioId();
        if (!data) throw new Error("No se encontró refugio");
        setRefugioId(data.id);
      } catch (err: any) {
        setError(err.message || "Error al cargar datos del refugio");
      } finally {
        setLoading(false);
      }
    };

    loadRefugio();
  }, []);

  const handleSave = async () => {
    if (!refugioId) return;
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
      await updateRefugio(refugioId, { nombre, direccion, telefono });
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

  const handleCancel = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);

      // Borra usuario en backend
      await deleteUsuario(user.id);

      // Limpieza local
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("goToFormulario");

      // pal loby
      onCancel();

    } catch (err) {
      console.error("Error al cancelar el formulario:", err);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={theme.colors.secondary} style={{ flex: 1, backgroundColor:theme.colors.background }} />;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor:theme.colors.background, justifyContent:"center", alignItems: "center",  }}>
      <View style = {{
        width: FORM_CARD_WIDTH,
        backgroundColor:theme.colors.backgroundSecondary,
        padding:20,
        borderRadius:10,
        borderWidth:2,
        borderColor:theme.colors.accent,
      }}>
        <Text style={[styles.label, {color:theme.colors.secondary}]}>Nombre:</Text>
        <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre del refugio" style={[styles.input, {color:theme.colors.text}]} placeholderTextColor={theme.colors.text}/>
        <Text style={[styles.label, {color:theme.colors.secondary}]}>Dirección:</Text>
        <TextInput value={direccion} onChangeText={setDireccion} placeholder="Dirección" style={[styles.input, {color:theme.colors.text}]} placeholderTextColor={theme.colors.text} />
        <Text style={[styles.label, {color:theme.colors.secondary}]}>Teléfono:</Text>
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
        {error && <Text style={[styles.error, {color:theme.colors.error}]}>{error}</Text>}

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
            onPress={handleCancel}
          >
            <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom:6,
    fontSize:15,
    fontWeight:"bold"
  },
  input: {
    borderWidth: 1, 
    borderColor: "gray", 
    padding: 8, 
    borderRadius: 4, 
    marginBottom: 10
  },
  error:{
    textAlign:"center",
    marginBottom:10,
  },
  button: {
    width: "100%",                      
    height: 48,                          
    borderRadius: 10,                    
    alignItems: "center",
    justifyContent: "center",
  },
});
