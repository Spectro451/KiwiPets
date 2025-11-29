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

// --------------------------------------------------
// UTILIDADES DE ESTILOS
// --------------------------------------------------
function pickerStyle(theme: any) {
  return {
    borderWidth: 1,
    borderColor: theme.colors.backgroundTertiary,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.text,
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

// --------------------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------------------

export default function AgregarMascotaScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const maxWidth = 480;
  const cardWidth =
    width <= 480
      ? width * 0.92
      : width <= 900
        ? Math.min(width * 0.8, maxWidth)
        : maxWidth;

  // --------------------------------------------------
  // CAMPOS PRINCIPALES
  // --------------------------------------------------
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState(0);
  const [tamaño, setTamaño] = useState<Tamaño>(Tamaño.MEDIANO);
  const [especie, setEspecie] = useState<Especie>(Especie.PERRO);
  const [genero, setGenero] = useState<Genero>(Genero.FEMENINO);
  const [esterilizado, setEsterilizado] = useState(false);
  const [posee_descendencia, setPosee] = useState(false);
  const [veces_adoptado, setVeces] = useState(0);
  const [discapacidad, setDiscapacidad] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [personalidad, setPersonalidad] = useState("");
  const [requisito, setRequisito] = useState("");
  const [estado, setEstado] = useState<Estado>(Estado.DISPONIBLE);
  const [foto, setFoto] = useState<string | undefined>();
  const [modalFoto, setModalFoto] = useState(false);
  const [modalOk, setModalOk] = useState(false);

  // --------------------------------------------------
  // VACUNAS
  // --------------------------------------------------
  const [vacunas, setVacunas] = useState<Omit<Vacunas, "id" | "mascota">[]>([]);
  const [vacFormVisible, setVacFormVisible] = useState(false);

  const [vacNombre, setVacNombre] = useState("");
  const [vacFecha, setVacFecha] = useState("");
  const [vacProx, setVacProx] = useState("");
  const [vacObs, setVacObs] = useState("");
  const [showPickVacAplic, setShowPickVacAplic] = useState(false);
  const [showPickVacProx, setShowPickVacProx] = useState(false);
  const [editVacIndex, setEditVacIndex] = useState<number | null>(null);

  // --------------------------------------------------
  // HISTORIAL CLÍNICO
  // --------------------------------------------------
  const [historial, setHistorial] = useState<Omit<Historial, "id" | "mascota">[]>([]);
  const [histFormVisible, setHistFormVisible] = useState(false);

  const [histDesc, setHistDesc] = useState("");
  const [histFecha, setHistFecha] = useState("");
  const [histVet, setHistVet] = useState("");
  const [histTrat, setHistTrat] = useState("");
  const [showHistPicker, setShowHistPicker] = useState(false);
  const [editHistIndex, setEditHistIndex] = useState<number | null>(null);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------
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
    } catch {
      return undefined;
    }
  };

  // --------------------------------------------------
  // FOTO
  // --------------------------------------------------
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const res: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!res.canceled) setFoto(res.assets[0].uri);
    setModalFoto(false);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const res: any = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) setFoto(res.assets[0].uri);
    setModalFoto(false);
  };

  // --------------------------------------------------
  // GUARDAR
  // --------------------------------------------------
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
      posee_descendencia,
      veces_adoptado,
      discapacidad,
      descripcion,
      personalidad,
      requisito_adopcion: requisito,
      fecha_ingreso: new Date(),
      estado_adopcion: estado,
      foto: fotoUrl,
      vacunas: vacunas as any,
      historialClinico: historial as any,
      vacunado: vacunas.length > 0,
    };

    try {
      await createMascota(data);
      setModalOk(true);
    } catch {
      alert("Error al crear mascota");
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
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

            {/* NOMBRE */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Nombre:</Text>
            <TextInput style={[styles.input, { color: theme.colors.text }]} value={nombre} onChangeText={setNombre} />

            {/* RAZA */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Raza:</Text>
            <TextInput style={[styles.input, { color: theme.colors.text }]} value={raza} onChangeText={setRaza} />

            {/* EDAD */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Edad:</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              keyboardType="number-pad"
              value={edad.toString()}
              onChangeText={(t) => setEdad(Number(t.replace(/[^0-9]/g, "")) || 0)}
            />

            {/* TAMAÑO */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Tamaño:</Text>
            <Picker selectedValue={tamaño} onValueChange={setTamaño} style={pickerStyle(theme)}>
              {Object.values(Tamaño).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            {/* ESPECIE */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Especie:</Text>
            <Picker selectedValue={especie} onValueChange={setEspecie} style={pickerStyle(theme)}>
              {Object.values(Especie).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            {/* GENERO */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Género:</Text>
            <Picker selectedValue={genero} onValueChange={setGenero} style={pickerStyle(theme)}>
              {Object.values(Genero).map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>

            {/* ESTERILIZADO */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Esterilizado:</Text>
            <Picker
              selectedValue={esterilizado ? "Si" : "No"}
              onValueChange={(v) => setEsterilizado(v === "Si")}
              style={pickerStyle(theme)}
            >
              <Picker.Item label="Si" value="Si" />
              <Picker.Item label="No" value="No" />
            </Picker>

            {/* DESCENDENCIA */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Posee descendencia:</Text>
            <Picker
              selectedValue={posee_descendencia ? "Si" : "No"}
              onValueChange={(v) => setPosee(v === "Si")}
              style={pickerStyle(theme)}
            >
              <Picker.Item label="Si" value="Si" />
              <Picker.Item label="No" value="No" />
            </Picker>

            {/* DESCRIPCION */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Descripción:</Text>
            <TextInput
              style={[styles.textarea, { color: theme.colors.text }]}
              multiline
              value={descripcion}
              onChangeText={setDescripcion}
            />

            {/* PERSONALIDAD */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Personalidad:</Text>
            <TextInput
              style={[styles.textarea, { color: theme.colors.text }]}
              multiline
              value={personalidad}
              onChangeText={setPersonalidad}
            />

            {/* REQUISITOS */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Requisitos de adopción:</Text>
            <TextInput
              style={[styles.textarea, { color: theme.colors.text }]}
              multiline
              value={requisito}
              onChangeText={setRequisito}
            />

            {/* VACUNAS */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Vacunas:</Text>

            {vacunas.length === 0 && (
              <Text style={{ color: theme.colors.text, marginBottom: 10 }}>
                No hay vacunas agregadas
              </Text>
            )}

            {vacunas.map((v, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.backgroundTertiary,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    flexShrink: 1,
                    flexWrap: "wrap",
                  }}
                  numberOfLines={0}
                >
                  {v.nombre} - {v.fecha_aplicacion.toLocaleDateString()} - {v.proxima_dosis?.toLocaleDateString()}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setVacNombre(v.nombre);
                      setVacFecha(v.fecha_aplicacion.toISOString().split("T")[0]);
                      setVacProx(v.proxima_dosis ? v.proxima_dosis.toISOString().split("T")[0] : "");
                      setVacFormVisible(true);
                    }}
                  >
                    <Text style={{ color: "orange", marginRight: 10 }}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setVacunas((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    <Text style={{ color: "red" }}>Borrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {vacFormVisible && (
              <View
                style={{
                  marginVertical: 10,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.accent,
                  borderRadius: 8,
                }}
              >
                <Text style={[styles.label, { color: theme.colors.secondary }]}>Nombre vacuna:</Text>
                <TextInput
                  value={vacNombre}
                  onChangeText={setVacNombre}
                  style={[styles.input, { color: theme.colors.text }]}
                />

                <Text style={[styles.label, { color: theme.colors.secondary }]}>Fecha aplicación:</Text>
                <TextInput
                  value={vacFecha}
                  onChangeText={setVacFecha}
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.text}
                />

                <Text style={[styles.label, { color: theme.colors.secondary }]}>Próxima dosis:</Text>
                <TextInput
                  value={vacProx}
                  onChangeText={setVacProx}
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.text}
                />

                <TouchableOpacity style={[btn(theme), { marginTop: 10 }]} onPress={() => {
                  const nueva = {
                    nombre: vacNombre,
                    fecha_aplicacion: parseFecha(vacFecha),
                    proxima_dosis: vacProx ? parseFecha(vacProx) : undefined,
                  };
                  setVacunas([...vacunas, nueva]);
                  setVacFormVisible(false);
                }}>
                  <Text style={styles.btnTxt}>Guardar Vacuna</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[btnCancel(theme)]}
                  onPress={() => setVacFormVisible(false)}
                >
                  <Text style={styles.btnTxt}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[btn(theme), { marginVertical: 12 }]}
              onPress={() => setVacFormVisible(true)}
            >
              <Text style={styles.btnTxt}>Agregar Vacuna</Text>
            </TouchableOpacity>

            {/* HISTORIAL */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Historial clínico:</Text>

            {historial.length === 0 && (
              <Text style={{ color: theme.colors.text, marginBottom: 10 }}>
                No hay historial agregado
              </Text>
            )}

            {historial.map((h, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.backgroundTertiary,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    flexShrink: 1,
                    flexWrap: "wrap",
                  }}
                  numberOfLines={0}
                >
                  {h.fecha.toLocaleDateString()} - {h.veterinario}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setHistDesc(h.descripcion);
                      setHistFecha(h.fecha.toISOString().split("T")[0]);
                      setHistVet(h.veterinario || "");
                      setHistTrat(h.tratamiento || "");
                      setHistFormVisible(true);
                    }}
                  >
                    <Text style={{ color: "orange", marginRight: 10 }}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setHistorial((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    <Text style={{ color: "red" }}>Borrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {histFormVisible && (
              <View
                style={{
                  marginVertical: 10,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.accent,
                  borderRadius: 8,
                }}
              >
                <Text style={[styles.label, { color: theme.colors.secondary }]}>Descripción:</Text>
                <TextInput
                  value={histDesc}
                  onChangeText={setHistDesc}
                  multiline
                  style={[styles.textarea, { color: theme.colors.text }]}
                />

                <Text style={[styles.label, { color: theme.colors.secondary }]}>Fecha:</Text>
                <TextInput
                  value={histFecha}
                  onChangeText={setHistFecha}
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.text}
                />

                <Text style={[styles.label, { color: theme.colors.secondary }]}>Veterinario:</Text>
                <TextInput
                  value={histVet}
                  onChangeText={setHistVet}
                  style={[styles.input, { color: theme.colors.text }]}
                />

                <Text style={[styles.label, { color: theme.colors.secondary }]}>Tratamiento:</Text>
                <TextInput
                  value={histTrat}
                  onChangeText={setHistTrat}
                  style={[styles.input, { color: theme.colors.text }]}
                />

                <TouchableOpacity
                  style={[btn(theme), { marginTop: 10 }]}
                  onPress={() => {
                    const nuevo = {
                      descripcion: histDesc,
                      fecha: parseFecha(histFecha),
                      veterinario: histVet,
                      tratamiento: histTrat,
                    };
                    setHistorial([...historial, nuevo]);
                    setHistFormVisible(false);
                  }}
                >
                  <Text style={styles.btnTxt}>Guardar Historial</Text>
                </TouchableOpacity>

                <TouchableOpacity style={btnCancel(theme)} onPress={() => setHistFormVisible(false)}>
                  <Text style={styles.btnTxt}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={[btn(theme), { marginVertical: 12 }]} onPress={() => setHistFormVisible(true)}>
              <Text style={styles.btnTxt}>Agregar Historial</Text>
            </TouchableOpacity>

            {/* BOTON GUARDAR */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>

              <TouchableOpacity
                onPress={guardar}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: theme.colors.backgroundTertiary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5,
                }}
              >
                <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
                  Guardar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: theme.colors.backgroundTertiary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 5,
                }}
              >
                <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL FOTO */}
      <Modal transparent visible={modalFoto} animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>Selecciona una opción</Text>

            <TouchableOpacity
              style={[
                btn(theme),
                {
                  marginBottom: 12,
                  width: "100%",        // << NUEVO
                  paddingHorizontal: 16 // << NUEVO
                },
              ]}
              onPress={takePhoto}
            >
              <Text style={styles.btnTxt}>Tomar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                btn(theme),
                {
                  width: "100%",        // << NUEVO
                  paddingHorizontal: 16 // << NUEVO
                },
              ]}
              onPress={pickImage}
            >
              <Text style={styles.btnTxt}>Elegir de la Galería</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => setModalFoto(false)} style={{ marginTop: 20 }}>
              <Text style={{ color: theme.colors.accent }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL OK */}
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

      {/* FORMULARIO DE VACUNA */}
      <Modal transparent visible={vacFormVisible} animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>Vacuna</Text>

            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Nombre"
              placeholderTextColor={theme.colors.text}
              value={vacNombre}
              onChangeText={setVacNombre}
            />

            <Text style={{ color: theme.colors.text }}>Fecha Aplicación</Text>

            {Platform.OS === "web" ? (
              <input
                type="date"
                value={vacFecha}
                onChange={(e) => setVacFecha(e.target.value)}
                style={{ padding: 8, marginBottom: 10 }}
              />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowPickVacAplic(true)} style={[styles.input]}>
                  <Text style={{ color: theme.colors.text }}>{vacFecha || "Seleccionar fecha"}</Text>
                </TouchableOpacity>

                {showPickVacAplic && (
                  <DateTimePicker
                    value={vacFecha ? parseFecha(vacFecha) : new Date()}
                    mode="date"
                    onChange={(_, d) => {
                      setShowPickVacAplic(false);
                      if (d) {
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, "0");
                        const day = String(d.getDate()).padStart(2, "0");
                        setVacFecha(`${y}-${m}-${day}`);
                      }
                    }}
                  />
                )}
              </>
            )}

            <Text style={{ color: theme.colors.text }}>Próxima dosis</Text>

            {Platform.OS === "web" ? (
              <input
                type="date"
                value={vacProx}
                onChange={(e) => setVacProx(e.target.value)}
                style={{ padding: 8, marginBottom: 10 }}
              />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowPickVacProx(true)} style={[styles.input]}>
                  <Text style={{ color: theme.colors.text }}>{vacProx || "Seleccionar fecha"}</Text>
                </TouchableOpacity>

                {showPickVacProx && (
                  <DateTimePicker
                    value={vacProx ? parseFecha(vacProx) : new Date()}
                    mode="date"
                    onChange={(_, d) => {
                      setShowPickVacProx(false);
                      if (d) {
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, "0");
                        const day = String(d.getDate()).padStart(2, "0");
                        setVacProx(`${y}-${m}-${day}`);
                      }
                    }}
                  />
                )}
              </>
            )}

            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Observaciones"
              placeholderTextColor={theme.colors.text}
              value={vacObs}
              onChangeText={setVacObs}
            />

            <TouchableOpacity
              style={[btn(theme), { marginTop: 10 }]}
              onPress={() => {
                const nueva: Omit<Vacunas, "id" | "mascota"> = {
                  nombre: vacNombre,
                  fecha_aplicacion: parseFecha(vacFecha),
                  proxima_dosis: vacProx ? parseFecha(vacProx) : undefined,
                  observaciones: vacObs || undefined,
                };

                if (editVacIndex !== null) {
                  setVacunas((prev) => {
                    const copia = [...prev];
                    copia[editVacIndex] = nueva;
                    return copia;
                  });
                  setEditVacIndex(null);
                } else {
                  setVacunas((prev) => [...prev, nueva]);
                }

                setVacNombre("");
                setVacFecha("");
                setVacProx("");
                setVacObs("");
                setVacFormVisible(false);
              }}
            >
              <Text style={styles.btnTxt}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={btnCancel(theme)} onPress={() => setVacFormVisible(false)}>
              <Text style={styles.btnTxt}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FORMULARIO HISTORIAL */}
      <Modal transparent visible={histFormVisible} animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>Historial Clínico</Text>

            <TextInput
              style={[styles.textarea, { color: theme.colors.text }]}
              placeholder="Descripción"
              placeholderTextColor={theme.colors.text}
              multiline
              value={histDesc}
              onChangeText={setHistDesc}
            />

            <Text style={{ color: theme.colors.text }}>Fecha</Text>

            {Platform.OS === "web" ? (
              <input
                type="date"
                value={histFecha}
                onChange={(e) => setHistFecha(e.target.value)}
                style={{ padding: 8, marginBottom: 10 }}
              />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowHistPicker(true)} style={[styles.input]}>
                  <Text style={{ color: theme.colors.text }}>{histFecha || "Seleccionar fecha"}</Text>
                </TouchableOpacity>
                {showHistPicker && (
                  <DateTimePicker
                    value={histFecha ? parseFecha(histFecha) : new Date()}
                    mode="date"
                    onChange={(_, d) => {
                      setShowHistPicker(false);
                      if (d) {
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, "0");
                        const day = String(d.getDate()).padStart(2, "0");
                        setHistFecha(`${y}-${m}-${day}`);
                      }
                    }}
                  />
                )}
              </>
            )}

            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Veterinario"
              placeholderTextColor={theme.colors.text}
              value={histVet}
              onChangeText={setHistVet}
            />

            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Tratamiento"
              placeholderTextColor={theme.colors.text}
              value={histTrat}
              onChangeText={setHistTrat}
            />

            <TouchableOpacity
              style={[btn(theme), { marginTop: 10 }]}
              onPress={() => {
                const nuevo: Omit<Historial, "id" | "mascota"> = {
                  descripcion: histDesc,
                  fecha: parseFecha(histFecha),
                  veterinario: histVet || undefined,
                  tratamiento: histTrat || undefined,
                };

                if (editHistIndex !== null) {
                  setHistorial((prev) => {
                    const copia = [...prev];
                    copia[editHistIndex] = nuevo;
                    return copia;
                  });
                  setEditHistIndex(null);
                } else {
                  setHistorial((prev) => [...prev, nuevo]);
                }

                setHistDesc("");
                setHistFecha("");
                setHistVet("");
                setHistTrat("");
                setHistFormVisible(false);
              }}
            >
              <Text style={styles.btnTxt}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={btnCancel(theme)} onPress={() => setHistFormVisible(false)}>
              <Text style={styles.btnTxt}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// ESTILOS
// --------------------------------------------------
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
    marginBottom: 12,
    minHeight: 46,
  },

  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 12,
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
