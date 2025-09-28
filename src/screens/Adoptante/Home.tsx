import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../../theme/ThemeContext";
import { useCallback, useState, useRef } from "react";
import { getMascotas } from "../../services/fetchMascotas";
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


  const handleSwipe = (dir: "left" | "right") => {
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);

    requestAnimationFrame(() => {
      swipeRef.current?.triggerSwipe(dir);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 400);
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
    }, 400);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchPets = async () => {
        setLoading(true)
        try {
          const data = await getMascotas();
          const disponibles = data.filter((pet: any) => pet.estado_adopcion !== "Adoptado");
          setPets(disponibles);
          const favoritosData = await getFavorito();
          const misFavoritos = favoritosData.filter((f: Favoritos) => f.adoptante?.usuario.id === currentUser?.id);
          setFavoritos(currentUser ? misFavoritos : []);
        } catch (error) {
          console.error("Error al obtener mascotas:", error);
        } finally{
          setLoading(false)
        }
      };
      fetchPets();
    }, [currentUser])
  );

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
            {favoritos.some(f => f.mascota.id_mascota === pets[swipeRef.current?.getCurrentIndex() ?? 0].id_mascota) ? "❤️" : "favorito"}
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
