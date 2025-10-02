import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Platform, KeyboardAvoidingView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useTheme } from "../../theme/ThemeContext";
import { Mascota } from "../../types/mascota";
import { Vacunas } from "../../types/vacunas";
import { Historial } from "../../types/historial";
import { Especie, Genero, Tamaño, Estado } from "../../types/enums";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMascota } from "../../services/fetchMascotas";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const FORM_CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 400);


export default function AgregarMascotaScreen({ navigation }: any) {
  const { theme } = useTheme();

  // Campos de Mascota
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState<number>(0);
  const [tamaño, setTamaño] = useState<Tamaño>(Tamaño.MEDIANO);
  const [especie, setEspecie] = useState<Especie>(Especie.PERRO);
  const [genero, setGenero] = useState<Genero>(Genero.FEMENINO);
  const [esterilizado, setEsterilizado] = useState(false);
  const [posee_descendencia, setPoseeDescendencia] = useState(false);
  const [veces_adoptado, setVecesAdoptado] = useState(0);
  const [fecha_ingreso, setFechaIngreso] = useState(new Date());
  const [discapacidad, setDiscapacidad] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [personalidad, setPersonalidad] = useState("");
  const [foto, setFoto] = useState<string | undefined>();
  const [requisito_adopcion, setRequisitoAdopcion] = useState("");
  const [estado_adopcion, setEstadoAdopcion] = useState<Estado>(Estado.DISPONIBLE);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<"fecha" | "proxima" | null>(null);

  // Arrays de vacunas e historial
  const [vacunas, setVacunas] = useState<Omit<Vacunas, "id" | "mascota">[]>([]);
  const [historialClinico, setHistorial] = useState<Omit<Historial, "id" | "mascota">[]>([]);

  // Modales
  const [modalVacunaVisible, setModalVacunaVisible] = useState(false);
  const [modalHistorialVisible, setModalHistorialVisible] = useState(false);

  // Campos temporales para modal
  const [editingVacunaIndex, setEditingVacunaIndex] = useState<number | null>(null);
  const [vacunaTemp, setVacunaTemp] = useState<Omit<Vacunas, "id" | "mascota">>({
    nombre: "",
    fecha_aplicacion: new Date(),
    proxima_dosis: undefined,
    observaciones: ""
  });

  const [editingHistorialIndex, setEditingHistorialIndex] = useState<number | null>(null);
  const [historialTemp, setHistorialTemp] = useState<Omit<Historial, "id" | "mascota">>({
    descripcion: "",
    fecha: new Date(),
    veterinario: "",
    tratamiento: ""
  });

  // Guardar mascota
  const handleSave = async () => {
    const nuevaMascota: Partial<Mascota> = {
      nombre,
      raza,
      edad,
      tamaño,
      especie,
      genero,
      esterilizado,
      posee_descendencia,
      veces_adoptado,
      fecha_ingreso,
      discapacidad,
      descripcion,
      personalidad,
      foto,
      requisito_adopcion,
      estado_adopcion,
      vacunas: vacunas as any,
      historialClinico: historialClinico as any,
      vacunado: vacunas.length > 0,
    };

    try {
      await createMascota(nuevaMascota);
      alert("Mascota creada con éxito!");
      navigation.goBack();
    } catch (error: any) {
      alert("Error al crear mascota: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <SafeAreaView edges={['top','bottom']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }} keyboardShouldPersistTaps="handled">
        <View style={{ width: FORM_CARD_WIDTH, backgroundColor: theme.colors.backgroundSecondary, padding: 20, borderRadius: 10, borderWidth: 2, borderColor: theme.colors.accent }}>
          
          {/* Nombre */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Nombre:</Text>
          <TextInput value={nombre} onChangeText={setNombre} style={[styles.input, { color: theme.colors.text }]} placeholder="Nombre de la mascota" placeholderTextColor={theme.colors.text} />

          {/* Raza */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Raza:</Text>
          <TextInput value={raza} onChangeText={setRaza} style={[styles.input, { color: theme.colors.text }]} placeholder="Raza" placeholderTextColor={theme.colors.text} />

          {/* Edad */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Edad:</Text>
          <TextInput value={edad.toString()} onChangeText={t => setEdad(Number(t))} keyboardType="number-pad" style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

          {/* Tamaño */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Tamaño:</Text>
          <Picker selectedValue={tamaño} onValueChange={setTamaño} style={[styles.input, { color: theme.colors.primary }]}>
            {Object.values(Tamaño).map(t => <Picker.Item key={t} label={t} value={t} />)}
          </Picker>

          {/* Especie */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Especie:</Text>
          <Picker selectedValue={especie} onValueChange={setEspecie} style={[styles.input, { color: theme.colors.primary }]}>
            {Object.values(Especie).map(e => <Picker.Item key={e} label={e} value={e} />)}
          </Picker>

          {/* Género */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Género:</Text>
          <Picker selectedValue={genero} onValueChange={setGenero} style={[styles.input, { color: theme.colors.primary }]}>
            {Object.values(Genero).map(g => <Picker.Item key={g} label={g} value={g} />)}
          </Picker>

          {/* Esterilizado */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Esterilizado:</Text>
          <Picker selectedValue={esterilizado ? "Si" : "No"} onValueChange={(v) => setEsterilizado(v === "Si")} style={[styles.input, { color: theme.colors.primary }]}>
            <Picker.Item label="Si" value="Si" />
            <Picker.Item label="No" value="No" />
          </Picker>

          {/* Discapacidad */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Discapacidad:</Text>
          <Picker selectedValue={discapacidad ? "Si" : "No"} onValueChange={(v) => setDiscapacidad(v === "Si")} style={[styles.input, { color: theme.colors.primary }]}>
            <Picker.Item label="Si" value="Si" />
            <Picker.Item label="No" value="No" />
          </Picker>

          {/* Descripción */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Descripción:</Text>
          <TextInput value={descripcion} onChangeText={setDescripcion} multiline style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

          {/* Personalidad */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Personalidad:</Text>
          <TextInput value={personalidad} onChangeText={setPersonalidad} multiline style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

          {/* Foto */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Foto URL:</Text>
          <TextInput value={foto} onChangeText={setFoto} style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

          {/* Requisito adopción */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Requisito de adopción:</Text>
          <TextInput value={requisito_adopcion} onChangeText={setRequisitoAdopcion} multiline style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

          {/* Botones modales para Vacunas e Historial */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Vacunas:</Text>
            {vacunas.length === 0 && <Text style={{ color: theme.colors.text, marginBottom: 10 }}>No hay vacunas agregadas</Text>}
            {vacunas.map((v, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, padding:5, borderWidth:1, borderColor:theme.colors.backgroundTertiary, borderRadius:5 }}>
                <Text style={{ color: theme.colors.text }}>{v.nombre} - {v.fecha_aplicacion.toLocaleDateString()}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => {
                    setVacunaTemp({ nombre: v.nombre, fecha_aplicacion: v.fecha_aplicacion, proxima_dosis: v.proxima_dosis, observaciones: v.observaciones });
                    setEditingIndex(i);
                    setModalVacunaVisible(true);
                  }}>
                    <Text style={{ color:'orange', marginRight: 10 }}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setVacunas(prev => prev.filter((_, idx) => idx !== i))}>
                    <Text style={{ color:'red' }}>Borrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={() => {
              setVacunaTemp({ nombre: "", fecha_aplicacion: new Date(), proxima_dosis: undefined, observaciones: "" });
              setEditingIndex(null);
              setModalVacunaVisible(true);
            }}>
              <Text style={{ color: theme.colors.secondary }}>Agregar Vacuna</Text>
            </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setModalHistorialVisible(true)}>
            <Text style={{ color: theme.colors.secondary }}>Agregar / Editar Historial ({historialClinico.length})</Text>
          </TouchableOpacity>

          {/* Guardar / Cancelar */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 5 }]} onPress={handleSave}>
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 5 }]} onPress={() => navigation.goBack()}>
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
      {/* Modal Vacuna */}
      <Modal visible={modalVacunaVisible} transparent animationType="slide">

      </Modal>

      {/* Modal Historial */}
      <Modal visible={modalHistorialVisible} transparent animationType="slide">
        {/* Implementar contenido para agregar / editar historial */}
      </Modal>

    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, fontSize: 15, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "gray", padding: 8, borderRadius: 4, marginBottom: 10 },
  button: { width: "100%", height: 48, borderRadius: 10, backgroundColor: "#444", alignItems: "center", justifyContent: "center", marginBottom: 10 },
});
