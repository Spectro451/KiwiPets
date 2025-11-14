import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../../theme/ThemeContext";
import { useCallback, useState, useRef } from "react";
import { getMascotas, getMascotasCercanas } from "../../services/fetchMascotas";
import PetSwipe from "../../components/petSwipe";
import SkeletonCard from "../../components/skeletonCard";
import { createAdopcion } from "../../services/fetchAdopcion";
import { createFavorito, deleteFavorito, getFavorito } from "../../services/fetchFavoritos";
import { Mascota } from "../../types/mascota";
import { Favoritos } from "../../types/favoritos";
import { useAuth } from "../../hooks/useAuth";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [pets, setPets] = useState<Mascota[]>([]);
  const swipeRef = useRef<{ triggerSwipe: (dir: "left" | "right") => void; getCurrentIndex: ()=>number; }>(null);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState<Favoritos[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const currentUser = useAuth().user;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [radioLocal, setRadioLocal] = useState<number>(5);
  const [sinResultados, setSinResultados] = useState(false);


  const handleSwipe = (dir: "left" | "right") => {
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);

    requestAnimationFrame(() => {
      swipeRef.current?.triggerSwipe(dir);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 450);
    });
  };

  const handleFavorito = async (mascotaId: number) => {
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);

    const favExist = favoritos.find(f => f.mascota.id_mascota === mascotaId);

    if (favExist) {
      // borra si hay favorito
      await deleteFavorito(favExist.id);
      setFavoritos(prev => prev.filter(f => f.mascota.id_mascota !== mascotaId));
    } else {
      // Si no está, agregar
      const nuevo = await createFavorito(mascotaId);
      if (nuevo) setFavoritos(prev => [nuevo, ...prev]);
    }

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 450);
  };

  const fetchMascotas = async (radio: number) => {
    setLoading(true);
    try {
      const data = await getMascotasCercanas(radio); 
      const disponibles = data.filter((pet: any) => pet.estado_adopcion !== "Adoptado");
      setPets(disponibles);

      if (disponibles.length === 0) setSinResultados(true);
      else setSinResultados(false);

      const favoritosData = await getFavorito();
      const misFavoritos = favoritosData.filter((f: Favoritos) => f.adoptante?.usuario.id === currentUser?.id);
      setFavoritos(currentUser ? misFavoritos : []);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      setRadioLocal(5);
      fetchMascotas(5);
    }, [currentUser])
  );

  const aumentarRadio = () => {
    if (radioLocal < 40) {
      const nuevoRadio = radioLocal + 5;
      setRadioLocal(nuevoRadio);
      fetchMascotas(nuevoRadio);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <SkeletonCard />

        {/* Botones Skeleton */}
        <View style={styles.buttonsContainer}>
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.button,
                { backgroundColor: theme.colors.backgroundTertiary, opacity: 0.5 },
              ]}
            />
          ))}
        </View>
      </View>
    );
  }

    if (sinResultados) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{color:theme.colors.text}}>
          No se encontraron mascotas en tu radio de {radioLocal} km.
        </Text>
        {radioLocal < 40 && (
          <TouchableOpacity
            onPress={aumentarRadio}
            style={{
              marginTop: 10,
              backgroundColor: theme.colors.accent,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Aumentar radio a {radioLocal + 5} km</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!pets.length) return <Text>No hay mascotas disponibles.</Text>;
  
return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <PetSwipe 
        ref={swipeRef} 
        pets={pets} 
        onSwipeEnd={async(dir, petId)=> {
          if(dir=="right"){
            const res = await createAdopcion(petId);
            if (res){
              console.log("adopcion creada", res);
            }
          }
          setFavoritos(prev => [...prev]);
        }}
        onIndexChange={setCurrentIndex}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isButtonDisabled ? theme.colors.backgroundSecondary : theme.colors.backgroundTertiary },
          ]}
          onPress={() => handleSwipe("left")}
          disabled={isButtonDisabled}
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Siguiente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isButtonDisabled ? theme.colors.backgroundSecondary : theme.colors.backgroundTertiary },
          ]}
          onPress={() => {
            const index = swipeRef.current?.getCurrentIndex() ?? 0;
            const petId = pets[index].id_mascota;
            handleFavorito(petId);
          }}
          disabled={isButtonDisabled}
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
            {favoritos.some(f => f.mascota.id_mascota === pets[currentIndex].id_mascota) ? "❤️" : "favorito"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isButtonDisabled ? theme.colors.backgroundSecondary : theme.colors.backgroundTertiary },
          ]}
          onPress={() => handleSwipe("right")}
          disabled={isButtonDisabled}
        >
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 65,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    margin: 10,
  },
});
