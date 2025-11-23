import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Platform, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useTheme } from "../../theme/ThemeContext";
import { Mascota } from "../../types/mascota";
import { Vacunas } from "../../types/vacunas";
import { Historial } from "../../types/historial";
import { Especie, Genero, Tamaño, Estado } from "../../types/enums";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateMascotas, getMascotasId } from "../../services/fetchMascotas";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { uploadToCloudinary } from '../../services/uploadFoto';

const { width } = Dimensions.get("window");

const isSmall = width <= 480;
const isTablet = width > 480 && width <= 840;

const FORM_CARD_WIDTH = isSmall
  ? width * 0.92
  : isTablet
  ? Math.min(width * 0.75, 480)
  : 480;

export default function FormularioEditarMascotaScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const { id_mascota } = route.params;

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
  const [showVacunaForm, setShowVacunaForm] = useState(false);
  const [showHistForm, setShowHistForm] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [fotoOriginal, setFotoOriginal] = useState<string | undefined>();
  const [modalExito, setModalExito] = useState(false);


  const [vacunas, setVacunas] = useState<Omit<Vacunas, "id" | "mascota">[]>([]);
  const [vacunaNombre, setVacunaNombre] = useState("");
  const [vacunaFecha, setVacunaFecha] = useState("");
  const [vacunaProxima, setVacunaProxima] = useState("");
  const [vacunaObs, setVacunaObs] = useState("");
  const [showPickerAplicacion, setShowPickerAplicacion] = useState(false);
  const [showPickerProxima, setShowPickerProxima] = useState(false);
  const [editingVacunaIndex, setEditingVacunaIndex] = useState<number | null>(null);

  const [historialClinico, setHistorial] = useState<Omit<Historial, "id" | "mascota">[]>([]);
  const [histFecha, setHistFecha] = useState("");
  const [histDescripcion, setHistDescripcion] = useState("");
  const [histVeterinario, setHistVeterinario] = useState("");
  const [histTratamiento, setHistTratamiento] = useState("");
  const [showPickerHistorial, setShowPickerHistorial] = useState(false);
  const [editingHistIndex, setEditingHistIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  // tontera enorme que arregla las fechas patrocinado por gpt
  const toDate = (d: any): Date | null => {
    if (!d && d !== 0) return null;
    if (d instanceof Date) {
      return isNaN(d.getTime()) ? null : d;
    }
    // si viene como número timestamp
    if (typeof d === "number") {
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? null : dt;
    }
    // si viene string
    if (typeof d === "string") {
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? null : dt;
    }
    return null;
  };

  const formatDate = (d: any) => {
    const dt = toDate(d);
    return dt ? dt.toLocaleDateString() : "Sin fecha";
  };

  const toDateInputString = (d: any) => {
    const dt = toDate(d);
    return dt ? dt.toISOString().split("T")[0] : "";
  };

  const parseFechaLocal = (fechaStr: string) => {
    const [y, m, d] = fechaStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  // Cargar datos de la mascota (parsear fechas correctamente)
  useEffect(() => {
    if (!id_mascota) return;
    const fetchMascota = async () => {
      try {
        const data = await getMascotasId(id_mascota);
        if (!data) {
          alert("No se encontró la mascota");
          setLoading(false);
          return;
        }

        // Parseo de vacunas
        const vacunasParseadas = (data.vacunas || []).map((v: any) => ({
          ...v,
          fecha_aplicacion: toDate(v.fecha_aplicacion),
          proxima_dosis: toDate(v.proxima_dosis),
        }));

        // Parseo de historial
        const historialParseado = (data.historialClinico || []).map((h: any) => ({
          ...h,
          fecha: toDate(h.fecha),
        }));

        setNombre(data.nombre ?? "");
        setRaza(data.raza ?? "");
        setEdad(typeof data.edad === "number" ? data.edad : 0);
        setTamaño(data.tamaño ?? Tamaño.MEDIANO);
        setEspecie(data.especie ?? Especie.PERRO);
        setGenero(data.genero ?? Genero.FEMENINO);
        setEsterilizado(Boolean(data.esterilizado));
        setPoseeDescendencia(Boolean(data.posee_descendencia));
        setVecesAdoptado(typeof data.veces_adoptado === "number" ? data.veces_adoptado : 0);
        setFechaIngreso(toDate(data.fecha_ingreso) ?? new Date());
        setDiscapacidad(Boolean(data.discapacidad));
        setDescripcion(data.descripcion ?? "");
        setPersonalidad(data.personalidad ?? "");
        setFoto(data.foto ?? undefined);
        setFotoOriginal(data.foto ?? undefined);
        setRequisitoAdopcion(data.requisito_adopcion ?? "");
        setEstadoAdopcion(data.estado_adopcion ?? Estado.DISPONIBLE);
        setVacunas(vacunasParseadas);
        setHistorial(historialParseado);
      } catch (error) {
        console.error("Error cargando mascota:", error);
        alert("Error al cargar la mascota");
      } finally {
        setLoading(false);
      }
    };
    fetchMascota();
  }, [id_mascota]);

  // Guardar cambios
  const handleSave = async () => {
    if (!nombre.trim()) return alert("El nombre es obligatorio");
    if (!raza.trim()) return alert("La raza es obligatoria");
    if (edad < 0 || edad > 100) return alert("Edad invalida");
    if (!descripcion.trim()) return alert("La descripción es obligatoria");
    if (!personalidad.trim()) return alert("La personalidad es obligatoria");
    if (!requisito_adopcion.trim()) return alert("El requisito de adopción es obligatorio");
    let uploadedUrl = foto;

    if (foto && foto !== fotoOriginal && !foto.startsWith("http")) {
      try {
        let fileToUpload;
        if (Platform.OS === "web") {
          const response = await fetch(foto);
          const blob = await response.blob();
          fileToUpload = new File([blob], "photo.jpg", { type: blob.type });
        } else {
          fileToUpload = {
            uri: foto,
            name: foto.split("/").pop() || "photo.jpg",
            type: "image/jpeg",
          };
        }

        uploadedUrl = await uploadToCloudinary(fileToUpload);
      } catch (error) {
        console.error(error);
        alert("Error subiendo la foto");
        return;
      }
    }

    // Antes de enviar, convertir las fechas en las vacunas/historial a ISO strings (si existen),
    // para que el backend reciba formatos estables.
    const vacunasParaEnviar = vacunas.map(v => ({
      ...v,
      fecha_aplicacion: toDate(v.fecha_aplicacion) ? toDate(v.fecha_aplicacion)!.toISOString() : null,
      proxima_dosis: toDate(v.proxima_dosis) ? toDate(v.proxima_dosis)!.toISOString() : null,
    }));

    const historialParaEnviar = historialClinico.map(h => ({
      ...h,
      fecha: toDate(h.fecha) ? toDate(h.fecha)!.toISOString() : null,
    }));

    const mascotaActualizada: Partial<Mascota> = {
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
      foto: uploadedUrl,
      requisito_adopcion,
      estado_adopcion,
      vacunas: vacunasParaEnviar as any,
      historialClinico: historialParaEnviar as any,
      vacunado: vacunas.length > 0,
    };

    try {
      await updateMascotas(id_mascota, mascotaActualizada);
      setFotoOriginal(uploadedUrl);
      setModalExito(true);
    } catch (error: any) {
      console.error("Error actualizando mascota:", error);
      alert("Error al actualizar mascota: " + (error.response?.data?.message || error.message));
    }
  };

  const handleVacuna = () => {
    if (!vacunaNombre.trim()) return alert("El nombre de la vacuna es obligatorio");
    if (!vacunaFecha) return alert("La fecha de aplicación es obligatoria");
    // vacunaFecha y vacunaProxima están en formato 'YYYY-MM-DD'
    const nuevaVacuna: Omit<Vacunas, "id" | "mascota"> = {
      nombre: vacunaNombre,
      fecha_aplicacion: parseFechaLocal(vacunaFecha),
      proxima_dosis: vacunaProxima ? parseFechaLocal(vacunaProxima) : undefined,
      observaciones: vacunaObs || undefined,
    };
    if (editingVacunaIndex !== null) {
      setVacunas(prev => {
        const copia = [...prev];
        copia[editingVacunaIndex] = nuevaVacuna;
        return copia;
      });
      setEditingVacunaIndex(null);
    } else {
      setVacunas(prev => [...prev, nuevaVacuna]);
    }
    setVacunaNombre("");
    setVacunaFecha("");
    setVacunaProxima("");
    setVacunaObs("");
    setShowVacunaForm(false);
  };

  const handleAgregarHistorial = () => {
    if (!histDescripcion.trim()) return alert("La descripción del historial es obligatoria");
    if (!histFecha) return alert("La fecha es obligatoria");
    const nuevoHistorial: Omit<Historial, "id" | "mascota"> = {
      descripcion: histDescripcion,
      fecha: parseFechaLocal(histFecha),
      veterinario: histVeterinario || undefined,
      tratamiento: histTratamiento || undefined,
    };
    if (editingHistIndex !== null) {
      setHistorial(prev => {
        const copia = [...prev];
        copia[editingHistIndex] = nuevoHistorial;
        return copia;
      });
      setEditingHistIndex(null);
    } else {
      setHistorial(prev => [...prev, nuevoHistorial]);
    }
    setHistDescripcion("");
    setHistFecha("");
    setHistVeterinario("");
    setHistTratamiento("");
    setShowHistForm(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Se necesitan permisos para acceder a la galería');

    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled) setFoto(result.assets[0].uri);
    setShowImageOptions(false);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return alert('Se necesitan permisos para usar la cámara');

    let result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setFoto(result.assets[0].uri);
    setShowImageOptions(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor:theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top','bottom']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }} keyboardShouldPersistTaps="handled">
          <View style={{ width: FORM_CARD_WIDTH, backgroundColor: theme.colors.backgroundSecondary, padding: 20, borderRadius: 10, borderWidth: 2, borderColor: theme.colors.accent }}>
            <TouchableOpacity
              onPress={() => setShowImageOptions(true)}
              style={{
                width: '100%',
                aspectRatio: 1,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: theme.colors.accent,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
                overflow: 'hidden',
              }}
            >
              {foto ? (
                <Image
                  source={{ uri: foto }}
                  style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                />
              ) : (
                <Text style={{ color: theme.colors.text, textAlign: 'center' }}>sube o toma tu foto</Text>
              )}
            </TouchableOpacity>

            {/* Modal de opciones */}
            <Modal
              visible={showImageOptions}
              transparent
              animationType="fade"
              onRequestClose={() => setShowImageOptions(false)}
            >
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
                <View style={{
                  width: 250,
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: 10,
                  padding: 20,
                  alignItems: 'center',
                }}>
                  <Text style={{ color: theme.colors.text, marginBottom: 20, fontWeight: 'bold' }}>Selecciona una opción</Text>
                  <TouchableOpacity
                    style={[styles.button, { width: '100%', marginBottom: 10 }]}
                    onPress={takePhoto}
                  >
                    <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>Tomar foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { width: '100%', backgroundColor: '#888' }]}
                    onPress={pickImage}
                  >
                    <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>Elegir de galería</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginTop: 15 }}
                    onPress={() => setShowImageOptions(false)}
                  >
                    <Text style={{ color: theme.colors.accent }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            
            {/* Nombre */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Nombre:</Text>
            <TextInput value={nombre} onChangeText={setNombre} style={[styles.input, { color: theme.colors.text }]} placeholder="Nombre de la mascota" placeholderTextColor={theme.colors.text} />

            {/* Raza */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Raza:</Text>
            <TextInput value={raza} onChangeText={setRaza} style={[styles.input, { color: theme.colors.text }]} placeholder="Raza" placeholderTextColor={theme.colors.text} />

            {/* Edad */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Edad:</Text>
            <TextInput
              value={edad.toString()}
              onChangeText={t => {
                const soloNumeros = t.replace(/[^0-9]/g, ""); // elimina letras
                setEdad(soloNumeros ? Number(soloNumeros) : 0);
              }}
              keyboardType="number-pad"
              style={[styles.input, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.text}
            />

            {/* Tamaño */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Tamaño:</Text>
            <Picker selectedValue={tamaño} onValueChange={setTamaño} style={[styles.input, { color: theme.colors.text, backgroundColor:theme.colors.backgroundSecondary }]}>
              {Object.values(Tamaño).map(t => <Picker.Item key={t} label={t} value={t} />)}
            </Picker>

            {/* Especie */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Especie:</Text>
            <Picker selectedValue={especie} onValueChange={setEspecie} style={[styles.input, { color: theme.colors.text, backgroundColor:theme.colors.backgroundSecondary }]}>
              {Object.values(Especie).map(e => <Picker.Item key={e} label={e} value={e} />)}
            </Picker>

            {/* Género */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Género:</Text>
            <Picker selectedValue={genero} onValueChange={setGenero} style={[styles.input, { color: theme.colors.text, backgroundColor:theme.colors.backgroundSecondary }]}>
              {Object.values(Genero).map(g => <Picker.Item key={g} label={g} value={g} />)}
            </Picker>

            {/* Esterilizado */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Esterilizado:</Text>
            <Picker selectedValue={esterilizado ? "Si" : "No"} onValueChange={(v) => setEsterilizado(v === "Si")} style={[styles.input, { color: theme.colors.text, backgroundColor:theme.colors.backgroundSecondary }]}>
              <Picker.Item label="Si" value="Si" />
              <Picker.Item label="No" value="No" />
            </Picker>

            {/* Discapacidad */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Discapacidad:</Text>
            <Picker selectedValue={discapacidad ? "Si" : "No"} onValueChange={(v) => setDiscapacidad(v === "Si")} style={[styles.input, { color: theme.colors.text, backgroundColor:theme.colors.backgroundSecondary }]}>
              <Picker.Item label="Si" value="Si" />
              <Picker.Item label="No" value="No" />
            </Picker>

            {/* Descripción */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Descripción:</Text>
            <TextInput value={descripcion} onChangeText={setDescripcion} multiline style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

            {/* Personalidad */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Personalidad:</Text>
            <TextInput value={personalidad} onChangeText={setPersonalidad} multiline style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />

            {/* Requisito adopción */}
            <Text style={[styles.label, { color: theme.colors.secondary }]}>Requisito de adopción:</Text>
            <TextInput value={requisito_adopcion} onChangeText={setRequisitoAdopcion} multiline style={[styles.input, { color: theme.colors.text }]} placeholderTextColor={theme.colors.text} />
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
                  {v.nombre} - {formatDate(v.fecha_aplicacion)} - {v.proxima_dosis ? formatDate(v.proxima_dosis) : "Sin próxima dosis"}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setVacunaNombre(v.nombre || "");
                      setVacunaFecha(toDateInputString(v.fecha_aplicacion));
                      setVacunaProxima(v.proxima_dosis ? toDateInputString(v.proxima_dosis) : '');
                      setVacunaObs(v.observaciones || '');
                      setShowVacunaForm(true);
                      setEditingVacunaIndex(i);
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
            {showVacunaForm && (
              <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderColor: theme.colors.accent, borderRadius: 8 }}>
                <Text style={[styles.label, { color: theme.colors.secondary }]}>Nombre vacuna:</Text>
                <TextInput
                  value={vacunaNombre}
                  onChangeText={setVacunaNombre}
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Nombre"
                  placeholderTextColor={theme.colors.text}
                />

                {/* Fecha aplicación */}
                <Text style={[styles.label, { color: theme.colors.secondary }]}>Fecha aplicación:</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    min="1900-01-01"
                    max="2100-12-31"
                    value={vacunaFecha}
                    onChange={e => setVacunaFecha(e.target.value)}
                    style={{  padding: 8, marginBottom: 10 }}
                  />
                ) : (
                  <>
                    <TouchableOpacity onPress={() => setShowPickerAplicacion(true)} style={[styles.input, { justifyContent: 'center' }]}>
                      <Text style={{ color: theme.colors.text }}>{vacunaFecha || 'Seleccionar fecha'}</Text>
                    </TouchableOpacity>
                    {showPickerAplicacion && (
                      <DateTimePicker
                        value={vacunaFecha ? parseFechaLocal(vacunaFecha) : new Date()}
                        mode="date"
                        display="default"
                        minimumDate={new Date(1900, 0, 1)}
                        maximumDate={new Date(2100, 11, 31)}
                        onChange={(_, selectedDate) => {
                          setShowPickerAplicacion(false);
                          if (selectedDate) {
                            const y = selectedDate.getFullYear();
                            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                            const d = String(selectedDate.getDate()).padStart(2, '0');
                            setVacunaFecha(`${y}-${m}-${d}`);
                          }
                        }}
                      />
                    )}
                  </>
                )}

                {/* Próxima dosis */}
                <Text style={[styles.label, { color: theme.colors.secondary }]}>Próxima dosis:</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    min="1900-01-01"
                    max="2100-12-31"
                    value={vacunaProxima}
                    onChange={e => setVacunaProxima(e.target.value)}
                    style={{  padding: 8, marginBottom: 10 }}
                  />
                ) : (
                  <>
                    <TouchableOpacity onPress={() => setShowPickerProxima(true)} style={[styles.input, { justifyContent: 'center' }]}>
                      <Text style={{ color: theme.colors.text }}>{vacunaProxima || 'Seleccionar fecha'}</Text>
                    </TouchableOpacity>
                    {showPickerProxima && (
                      <DateTimePicker
                        value={vacunaProxima ? parseFechaLocal(vacunaProxima) : new Date()}
                        mode="date"
                        display="default"
                        minimumDate={new Date(1900, 0, 1)}
                        maximumDate={new Date(2100, 11, 31)}
                        onChange={(_, selectedDate) => {
                          setShowPickerProxima(false);
                          if (selectedDate) {
                            const y = selectedDate.getFullYear();
                            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                            const d = String(selectedDate.getDate()).padStart(2, '0');
                            setVacunaProxima(`${y}-${m}-${d}`);
                          }
                        }}
                      />
                    )}
                  </>
                )}

                <Text style={[styles.label, { color: theme.colors.secondary }]}>Observaciones:</Text>
                <TextInput
                  value={vacunaObs}
                  onChangeText={setVacunaObs}
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Opcional"
                  placeholderTextColor={theme.colors.text}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 5 }]} onPress={handleVacuna}>
                    <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Guardar Vacuna</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 5, backgroundColor: '#888' }]} onPress={() => setShowVacunaForm(false)}>
                    <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={[styles.label, { color: theme.colors.secondary }]}>Historial clínico:</Text>

            {historialClinico.length === 0 && (
              <Text style={{ color: theme.colors.text, marginBottom: 10 }}>
                No hay historial agregado
              </Text>
            )}

            {historialClinico.map((h, i) => (
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
                  {formatDate(h.fecha)} - {h.veterinario}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      const h = historialClinico[i];
                      setHistDescripcion(h.descripcion || "");
                      setHistFecha(toDateInputString(h.fecha));
                      setHistVeterinario(h.veterinario || '');
                      setHistTratamiento(h.tratamiento || '');
                      setShowHistForm(true);
                      setEditingHistIndex(i);
                    }}
                  >
                    <Text style={{ color: "orange", marginRight: 10 }}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setHistorial(prev => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    <Text style={{ color: "red" }}>Borrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {showHistForm && (
              <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderColor: theme.colors.accent, borderRadius: 8 }}>
                <Text style={[styles.label, { color: theme.colors.secondary }]}>Descripción:</Text>
                <TextInput
                  value={histDescripcion}
                  onChangeText={setHistDescripcion}
                  multiline
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Descripción"
                  placeholderTextColor={theme.colors.text}
                />

                <Text style={[styles.label, { color: theme.colors.secondary }]}>Fecha:</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    min="1900-01-01"
                    max="2100-12-31"
                    value={histFecha}
                    onChange={e => setHistFecha(e.target.value)}
                    style={{ padding: 8, marginBottom: 10 }}
                  />
                ) : (
                  <>
                    <TouchableOpacity onPress={() => setShowPickerHistorial(true)} style={[styles.input, { justifyContent: 'center' }]}>
                      <Text style={{ color: theme.colors.text }}>{histFecha || 'Seleccionar fecha'}</Text>
                    </TouchableOpacity>
                    {showPickerHistorial && (
                      <DateTimePicker
                        value={histFecha ? parseFechaLocal(histFecha) : new Date()}
                        mode="date"
                        display="default"
                        minimumDate={new Date(1900, 0, 1)}
                        maximumDate={new Date(2100, 11, 31)}
                        onChange={(_, selectedDate) => {
                          setShowPickerHistorial(false);
                          if (selectedDate) {
                            const y = selectedDate.getFullYear();
                            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                            const d = String(selectedDate.getDate()).padStart(2, '0');
                            setHistFecha(`${y}-${m}-${d}`);
                          }
                        }}
                      />
                    )}
                  </>
                )}

                <Text style={[styles.label, { color: theme.colors.secondary }]}>Veterinario:</Text>
                <TextInput
                  value={histVeterinario}
                  onChangeText={setHistVeterinario}
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Nombre del veterinario"
                  placeholderTextColor={theme.colors.text}
                />

                <Text style={[styles.label, { color: theme.colors.secondary }]}>Tratamiento:</Text>
                <TextInput
                  value={histTratamiento}
                  onChangeText={setHistTratamiento}
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Tratamiento"
                  placeholderTextColor={theme.colors.text}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 5 }]} onPress={handleAgregarHistorial}>
                    <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>Guardar Historial</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 5, backgroundColor: '#888' }]} onPress={() => setShowHistForm(false)}>
                    <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={{ flexDirection: "column", marginVertical: 10 }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.accent, marginBottom: 10 }]}
                onPress={() => setShowVacunaForm(true)}
              >
                <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Agregar Vacuna</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.accent }]}
                onPress={() => setShowHistForm(true)}
              >
                <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Agregar Historial</Text>
              </TouchableOpacity>
            </View>

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
          <Modal visible={modalExito} transparent animationType="slide">
            <View style={styles.modalBackground}>
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: theme.colors.background,
                    borderWidth: 2,
                    borderColor: theme.colors.backgroundTertiary,
                  },
                ]}
              >
                <Text
                  style={{
                    marginBottom: 20,
                    textAlign: "center",
                    color: theme.colors.text,
                  }}
                >
                  ¡Mascota actualizada con éxito!
                </Text>
                <TouchableOpacity
                  style={[styles.buttonModal, { backgroundColor: "#4CAF50" }]}
                  onPress={() => {
                    setModalExito(false);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  label: { marginBottom: 6, fontSize: 15, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "gray", padding: 8, borderRadius: 4, marginBottom: 10 },
  button: { width: "100%", height: 48, borderRadius: 10, backgroundColor: "#444", alignItems: "center", justifyContent: "center", marginBottom: 10 },
    modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
  },
  modalContent: {
    width: Platform.OS === "web" ? 500 : 350,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonModal: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
