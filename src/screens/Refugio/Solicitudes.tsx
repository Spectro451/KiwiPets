import { useCallback, useEffect, useState } from "react";
import { Adopcion } from "../../types/adopcion";
import { getAdopcion } from "../../services/fetchAdopcion";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

interface MascotaSolicitudes{
  id:number;
  nombre:string;
  solicitudes:Adopcion[];
}

const Solicitudes = ({navigation}:any)=>{
  const [mascotas, setMascotas]= useState<MascotaSolicitudes[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { theme } = useTheme();

  useFocusEffect(
    useCallback(()=>{
      const fetchAdopciones = async ()=>{
        const adopciones: Adopcion[]=await getAdopcion();
        const filtradas = adopciones.filter(a=>a.estado === "En proceso");
        const grouped:{[key:number]: MascotaSolicitudes}={};
        filtradas.forEach(adopcion =>{
          const idMascota = adopcion.mascota.id_mascota;
          if(!grouped[idMascota]){
            grouped[idMascota]={ id:idMascota, nombre:adopcion.mascota.nombre, solicitudes:[] };
          }
          grouped[idMascota].solicitudes.push(adopcion);
        });
        setMascotas(Object.values(grouped));
      };
      fetchAdopciones();
    },[])
  );

  const renderMascota =({item}:{item: MascotaSolicitudes})=>{
    const isExpanded = expanded ===item.id;

    return(
      <View style={[styles.mascotaContainer, {backgroundColor:theme.colors.backgroundSecondary, borderColor:theme.colors.backgroundTertiary}]}>
        <TouchableOpacity onPress={()=>setExpanded(isExpanded?null:item.id)}>
          <Text style={[styles.mascotaNombre, {color:theme.colors.text}]}>{item.nombre}</Text>
          <Text style={[styles.mascotaNombre, {color:theme.colors.textSecondary}]}>{item.solicitudes.length} solicitudes</Text>
        </TouchableOpacity>

        {isExpanded &&
          item.solicitudes.map(solicitud=>(
            <TouchableOpacity 
              key={solicitud.id}
              style={[styles.solicitudContainer, {borderColor:theme.colors.backgroundTertiary}]}
              onPress={()=>
                navigation.push("DetalleAdopcion", {id: solicitud.id})
              }
            >
              <Text style={[styles.mascotaNombre, {color:theme.colors.text}]}>{solicitud.adoptante.nombre}</Text>
              <Text style={[styles.mascotaNombre, {color:theme.colors.textSecondary}]}>{solicitud.estado}</Text>
            </TouchableOpacity>
          ))
        }
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[styles.container, {backgroundColor:theme.colors.background}]}>
        {mascotas.length === 0 ? (
          <View style={[styles.emptyContainer]}>
            <Text style={styles.emptyText}>No hay solicitudes para tus mascotas aún.</Text>
          </View>
        ) : (
          <FlatList
            data={mascotas}
            keyExtractor={item => item.id.toString()}
            renderItem={renderMascota}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Solicitudes;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  mascotaContainer: { padding: 12, borderWidth: 1, marginBottom: 12, borderRadius: 8 },
  mascotaNombre: { fontWeight: "bold", fontSize: 16 },
  solicitudContainer: { padding: 8, marginLeft: 16, borderWidth: 2, borderColor: "#eee", borderRadius: 6, marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#888" },
});