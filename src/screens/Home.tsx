import { View, Text } from "react-native";
import PetCard from "../components/PetCard";


const pets = [
  {
  nombre: "Firulais",
  raza: "Labrador",
  foto: "https://images.ctfassets.net/denf86kkcx7r/3ZI881905qLLJ1Xm75c9aG/a7c8daf2b4c3837ebb61dbf4314d2bd8/perros_de_pastor_y_boyeros_-_2.jpg?fit=fill&w=1024&q=80",
  edad: "3 años",
  tamano: "Mediano",
  genero: "Macho",
  vacunado: true,
  esterilizado: false,
  descripcion: "Firulais es un perro muy amigable y juguetón, le encanta correr en el parque y hacer nuevos amigos.Firulais es un perro muy amigable y juguetón, le encanta correr en el parque y hacer nuevos amigos.Firulais es un perro muy amigable y juguetón, le encanta correr en el parque y hacer nuevos amigos.Firulais es un perro muy amigable y juguetón, le encanta correr en el parque y hacer nuevos amigos.Firulais es un perro muy amigable y juguetón, le encanta correr en el parque y hacer nuevos amigos.Firulais es un perro muy amigable y juguetón, le encanta correr en el parque y hacer nuevos amigos.",
  personalidad: "Juguetón, leal y sociable con niños",
  tiempo_en_refugio: "2 meses",
}
 
];
export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <PetCard pet={pets[0]} />
    </View>
  );
}
