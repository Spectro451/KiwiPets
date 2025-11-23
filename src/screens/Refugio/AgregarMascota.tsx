import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

import { useTheme } from "../../theme/ThemeContext";

import { Mascota } from "../../types/mascota";
import { Vacunas } from "../../types/vacunas";
import { Historial } from "../../types/historial";
import { Especie, Genero, Tamaño, Estado } from "../../types/enums";

import { createMascota } from "../../services/fetchMascotas";
import { uploadToCloudinary } from "../../services/uploadFoto";

// ======================================================
//   ESTILOS DINÁMICOS CORRECTOS
// ======================================================

function pickerStyle(theme: any) {
  return {
    borderWidth: 1,
    borderColor: theme.colors.backgroundTertiary,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: theme.colors.backgroundSecondary,
  } as const;
}

function btn(theme: any) {
  return {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  } as const;
}

function btnCancel(theme: any) {
  return {
    backgroundColor: theme.colors.backgroundTertiary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  } as const;
}

// ======================================================
//   COMPONENTE PRINCIPAL
// ======================================================

export default function AgregarMascotaScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const maxCardWidth = 480;

  const cardWidth =
  width <= 480
    ? width * 0.92
    : width <= 900
    ? Math.min(width * 0.8, maxCardWidth)
    : maxCardWidth;

  // ------------------------
  // CAMPOS PRINCIPALES
  // ------------------------
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState(0);
  const [tamaño, setTamaño] = useState<Tamaño>(Tamaño.MEDIANO);
  const [especie, setEspecie] = useState<Especie>(Especie.PERRO);
  const [genero, setGenero] = useState<Genero>(Genero.FEMENINO);
  const [esterilizado, setEsterilizado] = useState(false);
  const [discapacidad, setDiscapacidad] = useState(false);
  const [personalidad, setPersonalidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [requisito, setRequisito] = useState("");
  const [fechaIngreso] = useState(new Date());
  const [estado, setEstado] = useState<Estado>(Estado.DISPONIBLE);

  // FOTO
  const [foto, setFoto] = useState<string | undefined>();
  const [modalFoto, setModalFoto] = useState(false);
  const [modalOk, setModalOk] = useState(false);

  // ------------------------
  // VACUNAS
  // ------------------------
  const [vacunas, setVacunas] = useState<Omit<Vacunas, "id" | "mascota">[]>([]);
  const [vacFormVisible, setVacFormVisible] = useState(false);

  const [vacNombre, setVacNombre] = useState("");
  const [vacFecha, setVacFecha] = useState("");
  const [vacProx, setVacProx] = useState("");

  // ------------------------
  // HISTORIAL CLÍNICO
  // ------------------------
  const [historial, setHistorial] = useState<Omit<Historial, "id" | "mascota">[]>([]);
  const [histFormVisible, setHistFormVisible] = useState(false);

  const [histDesc, setHistDesc] = useState("");
  const [histFecha, setHistFecha] = useState("");
  const [histVet, setHistVet] = useState("");
  const [histTrat, setHistTrat] = useState("");

  // ------------------------
  // UTILS
  // ------------------------
  const parseFecha = (str: string) => {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const subirImagen = async () => {
    try {
      let file;

      if (Platform.OS === "web") {
        const r = await fetch(foto!);
        const blob = await r.blob();
        file = new File([blob], "photo.jpg", { type: blob.type });
      } else {
        file = {
          uri: foto,
          name: foto?.split("/").pop() || "photo.jpg",
          type: "image/jpeg",
        };
      }

      return await uploadToCloudinary(file);
    } catch (err) {
      console.log("Error subiendo foto:", err);
      return undefined;
    }
  };

  // ------------------------
  // FOTOS
  // ------------------------
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) setFoto(result.assets[0].uri);
    setModalFoto(false);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result: any = await ImagePicker.launchCameraAsync({ quality: 0.8 });

    if (!result.canceled) setFoto(result.assets[0].uri);
    setModalFoto(false);
  };

  // ------------------------
  // GUARDAR
  // ------------------------
  const guardar = async () => {
    if (!nombre.trim()) return alert("El nombre es obligatorio");
    if (!raza.trim()) return alert("La raza es obligatoria");
    if (!descripcion.trim()) return alert("Descripción obligatoria");
    if (!personalidad.trim()) return alert("Personalidad obligatoria");
    if (!requisito.trim()) return alert("Requisito obligatorio");

    let fotoUrl = foto;
    if (foto) fotoUrl = await subirImagen();

    const data: Partial<Mascota> = {
      nombre,
      raza,
      edad,
      tamaño,
      especie,
      genero,
      esterilizado,
      discapacidad,
      descripcion,
      personalidad,
      requisito_adopcion: requisito,
      fecha_ingreso: fechaIngreso,
      estado_adopcion: estado,
      foto: fotoUrl,
      vacunas: vacunas as any,
      historialClinico: historial as any,
      vacunado: vacunas.length > 0,
    };

    try {
      await createMascota(data);
      setModalOk(true);
    } catch (e) {
      alert("Error al crear mascota");
    }
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.center}>
          <View
            style={[
              styles.card,
              {
                width: cardWidth,
                backgroundColor: theme.colors.backgroundSecondary,
                borderColor: theme.colors.backgroundTertiary,
              },
            ]}
          >
            {/* FOTO */}
            <TouchableOpacity
              style={[styles.fotoBox, { borderColor: theme.colors.accent }]}
              onPress={() => setModalFoto(true)}
            >
              {foto ? (
                <Image source={{ uri: foto }} style={styles.fotoImg} />
              ) : (
                <Text style={{ color: theme.colors.text }}>Subir o tomar foto</Text>
              )}
            </TouchableOpacity>

            {/* CAMPOS */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Nombre</Text>
            <TextInput style={[styles.input, { color: theme.colors.text }]} value={nombre} onChangeText={setNombre} />

            <Text style={[styles.label, { color: theme.colors.secondary }]}>Raza</Text>
            <TextInput style={[styles.input, { color: theme.colors.text }]} value={raza} onChangeText={setRaza} />

            <Text style={[styles.label, { color: theme.colors.secondary }]}>Edad</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              keyboardType="number-pad"
              value={edad.toString()}
              onChangeText={(t) => setEdad(Number(t.replace(/[^0-9]/g, "")) || 0)}
            />

            {/* SELECTS */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Tamaño</Text>
            <Picker selectedValue={tamaño} onValueChange={setTamaño} style={pickerStyle(theme)}>
              {Object.values(Tamaño).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            <Text style={[styles.label, { color: theme.colors.secondary }]}>Especie</Text>
            <Picker selectedValue={especie} onValueChange={setEspecie} style={pickerStyle(theme)}>
              {Object.values(Especie).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            <Text style={[styles.label, { color: theme.colors.secondary }]}>Género</Text>
            <Picker selectedValue={genero} onValueChange={setGenero} style={pickerStyle(theme)}>
              {Object.values(Genero).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            <Text style={[styles.label, { color: theme.colors.secondary }]}>Descripción</Text>
            <TextInput
              multiline
              style={[styles.textarea, { color: theme.colors.text }]}
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <Text style={[styles.label, { color: theme.colors.secondary }]}>Personalidad</Text>
            <TextInput
              multiline
              style={[styles.textarea, { color: theme.colors.text }]}
              value={personalidad}
              onChangeText={setPersonalidad}
            />

            <Text style={[styles.label, { color: theme.colors.secondary }]}>Requisitos</Text>
            <TextInput
              multiline
              style={[styles.textarea, { color: theme.colors.text }]}
              value={requisito}
              onChangeText={setRequisito}
            />

            <TouchableOpacity style={[btn(theme), { marginTop: 12 }]} onPress={guardar}>
              <Text style={styles.btnTxt}>Guardar Mascota</Text>
            </TouchableOpacity>

            <TouchableOpacity style={btnCancel(theme)} onPress={() => navigation.goBack()}>
              <Text style={styles.btnTxt}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ---------------- MODAL FOTO ---------------- */}
      <Modal transparent visible={modalFoto} animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>Selecciona una opción</Text>

            <TouchableOpacity style={[btn(theme), { marginBottom: 10 }]} onPress={takePhoto}>
              <Text style={styles.btnTxt}>Tomar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={btn(theme)} onPress={pickImage}>
              <Text style={styles.btnTxt}>Elegir de galería</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalFoto(false)} style={{ marginTop: 20 }}>
              <Text style={{ color: theme.colors.accent }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ---------------- MODAL OK ---------------- */}
      <Modal transparent visible={modalOk} animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>¡Mascota creada con éxito!</Text>

            <TouchableOpacity
              style={[btn(theme), { width: 160 }]}
              onPress={() => {
                setModalOk(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.btnTxt}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ======================================================
//   ESTILOS ESTÁTICOS
// ======================================================

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },

  card: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  fotoBox: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  fotoImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 16,
    minHeight: 46,
  },

  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 16,
    minHeight: 110,
    textAlignVertical: "top",
  },

  btnTxt: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },

  modalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  modalBox: {
    width: "100%",
    maxWidth: 360,
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
  },
});