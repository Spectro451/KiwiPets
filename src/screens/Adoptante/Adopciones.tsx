import { useCallback, useEffect, useState,  } from "react";
import Checkbox from "expo-checkbox";
import { useTheme } from "../../theme/ThemeContext";
import { Adopcion } from "../../types/adopcion";
import { deleteAdopcion, getAdopcion } from "../../services/fetchAdopcion";
import { Alert, View, Image, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function AdopcionesScreen() {
  const { theme } = useTheme();
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdopciones = async () => {
    setLoading(true);
    try {
      const data = await getAdopcion();
      setAdopciones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAdopciones();
    }, [])
  );

  const toggleSelection = (id:number)=> {
    setSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(i=>i !==id):[...prev,id]
    );
  };

  const eliminarSeleccionadas = async () =>{
    if(seleccionadas.length===0){
      Alert.alert("Debe seleccionar almenos una");
      return;
    }
    try{
    await Promise.all(
      seleccionadas.map(id => {
        console.log("Enviando DELETE para adopción ID:", id); // <--- log aquí
        return deleteAdopcion(id);
      })
    );
      setAdopciones(prev=>prev.filter(a=>!seleccionadas.includes(a.id)));
      setSeleccionadas([]);
    }catch (err){
      console.error(err);
    }
  };

  const renderItem = ({item}: {item:Adopcion}) =>(
    <View style={[styles.itemContainer, {borderColor:theme.colors.backgroundTertiary, backgroundColor:theme.colors.backgroundSecondary}]}>
      <Checkbox
        value={seleccionadas.includes(item.id)}
        onValueChange={()=>toggleSelection(item.id)}
        color={seleccionadas.includes(item.id) ? theme.colors.accent: undefined}
      />
      <Image source={{uri:item.mascota.foto}} style={styles.foto}/>
      <View style={styles.info}>
        <Text style={[styles.nombre, {color:theme.colors.text}]}>{item.mascota.nombre}</Text>
        <Text style={[styles.fecha, { color: theme.colors.secondary }]}>
          {new Date(item.fecha_solicitud).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={adopciones}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchAdopciones}
      />
      <TouchableOpacity style={[styles.botonEliminar, { backgroundColor: theme.colors.error }]} onPress={eliminarSeleccionadas}>
        <Text style={styles.botonTexto}>Eliminar seleccionadas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  itemContainer: { flexDirection: "row", alignItems: "center", marginVertical: 8, borderWidth: 1, borderRadius: 10, padding: 10 },
  foto: { width: 60, height: 60, borderRadius: 30, marginHorizontal: 10, resizeMode: "contain"  },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: "bold" },
  fecha: { fontSize: 12 },
  botonEliminar: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10
  },
  botonTexto: { color: "#fff", fontWeight: "bold" }
});