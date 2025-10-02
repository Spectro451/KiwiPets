import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Platform, KeyboardAvoidingView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useTheme } from "../../theme/ThemeContext";
import { Mascota } from "../../types/mascota";
import { Vacunas } from "../../types/vacunas";
import { Historial } from "../../types/historial";
import { Especie, Genero, Tamaño, Estado } from "../../types/enums";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const FORM_CARD_WIDTH = isWeb ? Math.min(width * 0.6, 480) : Math.min(width * 0.94, 400);


export default function FormCrearMascota({ navigation }: any) {
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

  // Arrays de vacunas e historial
  const [vacunas, setVacunas] = useState<Vacunas[]>([]);
  const [historialClinico, setHistorial] = useState<Historial[]>([]);

  // Modales
  const [modalVacunaVisible, setModalVacunaVisible] = useState(false);
  const [modalHistorialVisible, setModalHistorialVisible] = useState(false);

  // Campos temporales para modal
  const [vacunaTemp, setVacunaTemp] = useState<Omit<Vacunas, "id" | "mascota">>({ nombre: "", fecha_aplicacion: new Date(), proxima_dosis: undefined, observaciones: "" });
  const [historialTemp, setHistorialTemp] = useState<Omit<Historial, "id" | "mascota">>({ descripcion: "", fecha: new Date(), veterinario: "", tratamiento: "" });

  // Guardar mascota
  const handleSave = () => {
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
      vacunas,
      historialClinico,
      vacunado: vacunas.length > 0, // calculado automáticamente
    };
  };

  return (
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

          {/* Estado adopción */}
          <Text style={[styles.label, { color: theme.colors.secondary }]}>Estado de adopción:</Text>
          <Picker selectedValue={estado_adopcion} onValueChange={setEstadoAdopcion} style={[styles.input, { color: theme.colors.primary }]}>
            {Object.values(Estado).map(e => <Picker.Item key={e} label={e} value={e} />)}
          </Picker>

          {/* Botones modales para Vacunas e Historial */}
          <TouchableOpacity style={styles.button} onPress={() => setModalVacunaVisible(true)}>
            <Text style={{ color: theme.colors.secondary }}>Agregar / Editar Vacunas ({vacunas.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setModalHistorialVisible(true)}>
            <Text style={{ color: theme.colors.secondary }}>Agregar / Editar Historial ({historialClinico.length})</Text>
          </TouchableOpacity>

          {/* Guardar / Cancelar */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 5 }]} onPress={handleSave}>
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 5 }]} onPress={navigation.goBack()}>
              <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Aquí van los modales de Vacunas e Historial */}
      {/* Modal Vacuna */}
      <Modal visible={modalVacunaVisible} transparent animationType="slide">
        {/* Implementar contenido para agregar / editar vacunas */}
      </Modal>

      {/* Modal Historial */}
      <Modal visible={modalHistorialVisible} transparent animationType="slide">
        {/* Implementar contenido para agregar / editar historial */}
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, fontSize: 15, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "gray", padding: 8, borderRadius: 4, marginBottom: 10 },
  button: { width: "100%", height: 48, borderRadius: 10, backgroundColor: "#444", alignItems: "center", justifyContent: "center", marginBottom: 10 },
});
