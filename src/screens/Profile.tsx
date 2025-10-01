import { View, Text, ActivityIndicator, TouchableOpacity, Platform, DevSettings } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { adoptanteByUsuarioId } from "../services/fetchAdoptante";
import { refugioByUsuarioId } from "../services/fetchRefugio";

interface ProfileScreenProps {
  route: { params: { onLogout?: () => Promise<void> } };
}

export default function ProfileScreen({ route }: ProfileScreenProps) {
  const {user} = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const onLogout = route.params?.onLogout;

  useFocusEffect(
    useCallback(()=>{
      const fetchProfile = async () =>{
        if(!user) return;
        setLoading(true);
        try {
          const profileData =
            user?.tipo === "Adoptante"
              ? await adoptanteByUsuarioId()
              : await refugioByUsuarioId();
          setData(profileData);
        } catch(error){
          console.error("Error al cargar el perfil: ", error);
        } finally{
          setLoading(false);
        }
      };
      fetchProfile();
    }, [user])
  );



  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{data.nombre}</Text>
      <Text style={{ marginTop: 10 }}>
        {user?.tipo === "Adoptante" ? `RUT: ${data.rut}` : `Teléfono: ${data.telefono}`}
      </Text>
      <Text>
        {user?.tipo === "Adoptante" ? `Edad: ${data.edad}` : `Dirección: ${data.direccion}`}
      </Text>

      <TouchableOpacity
        onPress={onLogout}
        style={{
          marginTop: 30,
          backgroundColor: "#FF3B30",
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
