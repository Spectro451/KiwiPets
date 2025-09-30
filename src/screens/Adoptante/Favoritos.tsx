import { useCallback, useEffect, useState,  } from "react";
import Checkbox from "expo-checkbox";
import { useTheme } from "../../theme/ThemeContext";
import { Favoritos } from "../../types/favoritos";
import { deleteFavorito, getFavorito } from "../../services/fetchFavoritos";
import { Alert, View, Image, StyleSheet, FlatList, TouchableOpacity, Text, Dimensions, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default function FavoritosScreen() {
  const { theme } = useTheme();
  const [favoritos, setFavoritos] = useState<Favoritos[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [botonBloqueado, setBotonBloqueado] = useState(false);



  const fetchFavoritos = async () => {
    setLoading(true);
    try {
      const data = await getFavorito();
      setFavoritos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavoritos();
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
    if(botonBloqueado) return;
    setBotonBloqueado(true);
    try{
    await Promise.all(
      seleccionadas.map(id => {
        console.log("Enviando DELETE para adopción ID:", id);
        return deleteFavorito(id);
      })
    );
      setFavoritos(prev=>prev.filter(a=>!seleccionadas.includes(a.id)));
      setSeleccionadas([]);
    }catch (err){
      console.error(err);
    }finally {
      setTimeout(() => setBotonBloqueado(false), 150);
    }
  };

  const renderItem = ({item}: {item:Favoritos}) =>(
    <TouchableOpacity
      onPress={() => toggleSelection(item.id)}
      style={[styles.itemContainer, {borderColor: theme.colors.backgroundTertiary, backgroundColor: theme.colors.backgroundSecondary}]}
    >
      <Checkbox
        value={seleccionadas.includes(item.id)}
        color={seleccionadas.includes(item.id) ? theme.colors.accent : undefined}
        onValueChange={() => {}} // dejamos vacío, solo se marca con el TouchableOpacity
      />
      <Image source={{uri:item.mascota.foto}} style={styles.foto}/>
      <View style={styles.info}>
        <View style={styles.subSeccion}>
          <Text style={[styles.nombre, {color: theme.colors.text}]}>{item.mascota.nombre}</Text>
          <Text style={[styles.subtitulo, {color: theme.colors.textSecondary}]}>Nombre</Text>
        </View>

        <View style={styles.subSeccion}>
          <Text style={[styles.nombre, {color: theme.colors.text}]}>{item.mascota.tamaño}</Text>
          <Text style={[styles.subtitulo, {color: theme.colors.textSecondary}]}>Tamaño</Text>
        </View>

        <View style={styles.subSeccion}>
          <Text style={[styles.nombre, {color: theme.colors.text}]}>{item.mascota.vacunado ? "Sí" : "No"}</Text>
          <Text style={[styles.subtitulo, {color: theme.colors.textSecondary}]}>Vacunado</Text>
        </View>

        <View style={styles.subSeccion}>
          <Text style={[styles.nombre, {color: theme.colors.text}]}>{item.mascota.esterilizado ? "Sí" : "No"}</Text>
          <Text style={[styles.subtitulo, {color: theme.colors.textSecondary}]}>Esterilizado</Text>
        </View>

        <View style={styles.subSeccion}>
          <Text style={[styles.nombre, {color: theme.colors.text}]}>{item.mascota.edad}</Text>
          <Text style={[styles.subtitulo, {color: theme.colors.textSecondary}]}>Años</Text>
        </View>

        <View style={styles.subSeccion}>
          <Text style={[styles.nombre, {color: theme.colors.text}]}>{item.mascota.estado_adopcion}</Text>
          <Text style={[styles.subtitulo, {color: theme.colors.textSecondary}]}>Estado adopción</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

return (
  <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
    <Text style={[styles.titulo, { color: theme.colors.text }]}>
      Mis favoritos
    </Text>
    <FlatList
      data={favoritos}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      refreshing={loading}
      onRefresh={fetchFavoritos}
    />
    <TouchableOpacity
      style={[
        styles.botonEliminar,
        { 
          backgroundColor: seleccionadas.length > 0 ? theme.colors.error : theme.colors.errorDeshabilitado,
          opacity: seleccionadas.length > 0 ? 1 : 0.6
        }
      ]}
      onPress={eliminarSeleccionadas} 
      disabled={seleccionadas.length === 0 || botonBloqueado}
     >
      <Text style={styles.botonTexto}>Eliminar seleccionadas</Text>
    </TouchableOpacity>
  </SafeAreaView>
);
}

const CARD_WIDTH = isWeb ? width * 0.95 : Math.min(width * 0.95, 480);
const styles = StyleSheet.create({
  container: { flex: 1},
  itemContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 8, 
    borderWidth: 1, 
    borderRadius: 10, 
    padding: 10, 
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  foto: { width: 60, height: 60, borderRadius: 30, marginHorizontal: 10, resizeMode: "contain"  },
  info: { flex: 1, flexDirection:"row", justifyContent:"space-around" },
  subSeccion: { flex: 1, flexDirection:"column", justifyContent:"space-around" },
  nombre: { fontSize: isWeb ? 18 : 11, fontWeight: "bold",textAlign:"center" },
  fecha: { fontSize: 12 },
  botonEliminar: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
  },
  botonTexto: { color: "#fff", fontWeight: "bold" },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign:"center"
  },
  subtitulo: {
    fontSize: isWeb ? 12 : 8,
    textAlign:"center"
  }
});