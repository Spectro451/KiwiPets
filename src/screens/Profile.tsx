import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  adoptanteByUsuarioId,
  updateAdoptante,
} from "../services/fetchAdoptante";
import { getAdopcion } from "../services/fetchAdopcion";
import { getFavorito } from "../services/fetchFavoritos";
import { getNotificaciones } from "../services/fetchNotificaciones";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import { refugioByUsuarioId } from "../services/fetchRefugio";
import { getMascotas } from "../services/fetchMascotas";
import Slider from "@react-native-community/slider";

interface ProfileScreenProps {
  route: { params: { onLogout?: () => Promise<void> } };
}

export default function ProfileScreen({ route }: ProfileScreenProps) {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation: any = useNavigation();
  const onLogout = route.params?.onLogout;
  const [adopcionesCount, setAdopcionesCount] = useState(0);
  const [favoritosCount, setFavoritosCount] = useState(0);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [mascotasCount, setMascotasCount] = useState(0);
  const [radioBusqueda, setRadioBusqueda] = useState(data?.radio_busqueda || 5);
  const [actualizandoRadio, setActualizandoRadio] = useState(false);

  const { theme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
          if (user.tipo === "Adoptante") {
            const profileData = await adoptanteByUsuarioId();
            setData(profileData);
            setRadioBusqueda(profileData.radio_busqueda ?? 5);

            const adopciones = await getAdopcion();
            setAdopcionesCount(adopciones.length);
            const favoritos = await getFavorito();
            setFavoritosCount(favoritos.length);
            const notificaciones = await getNotificaciones();
            setNotificacionesCount(notificaciones.length);
          } else if (user.tipo === "Refugio") {
            const profileData = await refugioByUsuarioId();
            setData(profileData);

            const notificaciones = await getNotificaciones();
            setNotificacionesCount(notificaciones.length);
            const mascotas = await getMascotas();
            setMascotasCount(mascotas.length || 0);
            const adopciones = await getAdopcion();
            setAdopcionesCount(adopciones.length);
          }
        } catch (error) {
          console.error("Error al cargar el perfil: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }, [user])
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No se encontró información del perfil</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 4 }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={[styles.nombre, { color: theme.colors.text }]}>
                {data.nombre}
              </Text>
              {user?.tipo === "Adoptante" ? (
                <Text
                  style={[
                    styles.subtitulo,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Tipo: {user?.tipo} | RUT: {data.rut}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.subtitulo,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Dirección: {data.direccion} | Validado:{" "}
                  {data.validado ? "si" : "no"}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.push(
                  user?.tipo === "Adoptante"
                    ? "EditarPerfilAdoptante"
                    : "EditarPerfilRefugio",
                  { perfilData: data }
                )
              }
              style={{ padding: 8 }}
            >
              <MaterialIcons
                name="edit"
                size={24}
                color={theme.colors.accent}
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 30 }}>
            {user?.tipo === "Adoptante" && (
              <>
                <View
                  style={[
                    styles.seccion,
                    { backgroundColor: theme.colors.backgroundSecondary },
                  ]}
                >
                  <Text
                    style={[styles.seccionTitulo, { color: theme.colors.text }]}
                  >
                    Solicitudes
                  </Text>
                  <Text
                    style={[
                      styles.seccionNumero,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {adopcionesCount}
                  </Text>
                </View>

                <View
                  style={[
                    styles.seccion,
                    { backgroundColor: theme.colors.backgroundSecondary },
                  ]}
                >
                  <Text
                    style={[styles.seccionTitulo, { color: theme.colors.text }]}
                  >
                    Favoritos
                  </Text>
                  <Text
                    style={[
                      styles.seccionNumero,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {favoritosCount}
                  </Text>
                </View>
                <View
                  style={[
                    styles.seccion,
                    { backgroundColor: theme.colors.backgroundSecondary },
                  ]}
                >
                  <Text
                    style={[styles.seccionTitulo, { color: theme.colors.text }]}
                  >
                    Radio de búsqueda: {radioBusqueda} km
                  </Text>

                  <Slider
                    style={{ width: "100%", marginTop: 10 }}
                    minimumValue={5}
                    maximumValue={40}
                    step={5}
                    value={radioBusqueda}
                    onValueChange={setRadioBusqueda}
                    minimumTrackTintColor={theme.colors.accent}
                    maximumTrackTintColor={theme.colors.textSecondary}
                  />

                  <TouchableOpacity
                    disabled={actualizandoRadio}
                    onPress={async () => {
                      try {
                        setActualizandoRadio(true);
                        await updateAdoptante(data.rut, {
                          radio_busqueda: radioBusqueda,
                        });
                      } finally {
                        setActualizandoRadio(false);
                      }
                    }}
                    style={{
                      marginTop: 10,
                      backgroundColor: theme.colors.accent,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                      opacity: actualizandoRadio ? 0.5 : 1,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {actualizandoRadio
                        ? "Actualizando..."
                        : "Actualizar Radio"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {user?.tipo === "Refugio" && (
              <>
                <View
                  style={[
                    styles.seccion,
                    { backgroundColor: theme.colors.backgroundSecondary },
                  ]}
                >
                  <Text
                    style={[styles.seccionTitulo, { color: theme.colors.text }]}
                  >
                    Mascotas
                  </Text>
                  <Text
                    style={[
                      styles.seccionNumero,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {mascotasCount}
                  </Text>
                </View>
                <View
                  style={[
                    styles.seccion,
                    { backgroundColor: theme.colors.backgroundSecondary },
                  ]}
                >
                  <Text
                    style={[styles.seccionTitulo, { color: theme.colors.text }]}
                  >
                    Solicitudes
                  </Text>
                  <Text
                    style={[
                      styles.seccionNumero,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {adopcionesCount}
                  </Text>
                </View>
              </>
            )}
            <View
              style={[
                styles.seccion,
                { backgroundColor: theme.colors.backgroundSecondary },
              ]}
            >
              <Text
                style={[styles.seccionTitulo, { color: theme.colors.text }]}
              >
                Notificaciones
              </Text>
              <Text
                style={[
                  styles.seccionNumero,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {notificacionesCount}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.push("EditarUsuario")}
            style={styles.botonEditarUsuario}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Editar Usuario
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ alignItems: "flex-end", marginTop: 20, marginBottom: 30 }}
        >
          <TouchableOpacity onPress={onLogout} style={styles.botonCerrarSesion}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nombre: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitulo: {
    fontSize: 15,
    marginTop: 4,
  },
  seccion: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
  },
  seccionTitulo: {
    fontSize: 15,
  },
  seccionNumero: {
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 4,
  },
  botonEditarUsuario: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  botonCerrarSesion: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
});
