import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import SwipeCards from "../components/SwipeCards"; // Importa el componente nuevo
import { useTheme } from "../theme/ThemeContext";

const pets = [
  {
    id: "1",
    refugio_id: "ref123",
    nombre: "Firulais",
    raza: "Labrador",
    foto: "https://images.ctfassets.net/denf86kkcx7r/3ZI881905qLLJ1Xm75c9aG/a7c8daf2b4c3837ebb61dbf4314d2bd8/perros_de_pastor_y_boyeros_-_2.jpg?fit=fill&w=1024&q=80",
    edad: "3 años",
    tamano: "Mediano",
    especie: "Perro",
    genero: "Macho",
    vacunado: true,
    esterilizado: false,
    veces_adoptado: 0,
    tiempo_en_refugio: "2 meses",
    discapacidad: false,
    descripcion: "Firulais es un perro muy amigable y juguetón, le encanta correr en el parque y hacer nuevos amigos.",
    personalidad: "Juguetón, leal y sociable con niños",
    posee_descendencia: false,
    fecha_ingreso: "2025-07-10",
    requisitos_adopcion: "Hogar con espacio para jugar, compromiso de paseos diarios",
    vacunas: [
      { id: "v1", nombre: "Antirrábica", fecha_aplicacion: "2025-07-15", proxima_dosis: "2026-07-15", observaciones: "Dosis anual" },
      { id: "v2", nombre: "Parvovirus", fecha_aplicacion: "2025-07-15", proxima_dosis: "2025-10-15" }
    ],
    historial_clinico: [
      { id: "h1", fecha: "2025-07-12", descripcion: "Chequeo general, se encuentra saludable.", veterinario: "Dr. Pérez", tratamiento: "Ninguno" },
      { id: "h2", fecha: "2025-07-20", descripcion: "Leve infección en oído tratada con antibiótico.", veterinario: "Dra. Gómez", tratamiento: "Aplicación de antibiótico durante 7 días" }
    ]
  },
  {
    id: "2",
    refugio_id: "ref124",
    nombre: "Mimi",
    raza: "Siamés",
    foto: "https://cdn2.thecatapi.com/images/ai6.jpg",
    edad: "2 años",
    tamano: "Pequeño",
    especie: "Gato",
    genero: "Hembra",
    vacunado: true,
    esterilizado: true,
    veces_adoptado: 1,
    tiempo_en_refugio: "1 mes",
    discapacidad: false,
    descripcion: "Mimi es una gata curiosa y tranquila, le gusta acurrucarse y que la acaricien.",
    personalidad: "Cariñosa, tranquila y juguetona",
    posee_descendencia: false,
    fecha_ingreso: "2025-08-01",
    requisitos_adopcion: "Hogar sin otros gatos dominantes",
    vacunas: [
      { id: "v3", nombre: "Triple felina", fecha_aplicacion: "2025-08-05", proxima_dosis: "2026-08-05" }
    ],
    historial_clinico: [
      { id: "h3", fecha: "2025-08-02", descripcion: "Chequeo general y esterilización exitosa.", veterinario: "Dra. Ramírez", tratamiento: "Reposo post-quirúrgico" }
    ]
  },
  {
    id: "3",
    refugio_id: "ref125",
    nombre: "Roco",
    raza: "Bulldog Francés",
    foto: "https://cdn2.thedogapi.com/images/B1svZgqE7.jpg",
    edad: "4 años",
    tamano: "Pequeño",
    especie: "Perro",
    genero: "Macho",
    vacunado: true,
    esterilizado: true,
    veces_adoptado: 2,
    tiempo_en_refugio: "3 meses",
    discapacidad: true,
    descripcion: "Roco tiene una cojera ligera pero es muy amigable y le encanta jugar con pelotas.",
    personalidad: "Activo, cariñoso y juguetón",
    posee_descendencia: false,
    fecha_ingreso: "2025-06-10",
    requisitos_adopcion: "Hogar sin escaleras pronunciadas",
    vacunas: [
      { id: "v4", nombre: "Antirrábica", fecha_aplicacion: "2025-06-15", proxima_dosis: "2026-06-15" }
    ],
    historial_clinico: [
      { id: "h4", fecha: "2025-06-12", descripcion: "Revisión por cojera, tratamiento con fisioterapia.", veterinario: "Dr. López", tratamiento: "Fisioterapia semanal" }
    ]
  },
  {
    id: "4",
    refugio_id: "ref126",
    nombre: "Luna",
    raza: "Golden Retriever",
    foto: "https://cdn2.thedogapi.com/images/H1dGlxqE7.jpg",
    edad: "1 año",
    tamano: "Grande",
    especie: "Perro",
    genero: "Hembra",
    vacunado: false,
    esterilizado: false,
    veces_adoptado: 0,
    tiempo_en_refugio: "1 semana",
    discapacidad: false,
    descripcion: "Luna es enérgica y muy inteligente, ideal para familias activas.",
    personalidad: "Inteligente, activa y leal",
    posee_descendencia: false,
    fecha_ingreso: "2025-09-07",
    requisitos_adopcion: "Familia con tiempo para ejercicio diario",
    vacunas: [],
    historial_clinico: []
  },
  {
    id: "5",
    refugio_id: "ref127",
    nombre: "Simba",
    raza: "Maine Coon",
    foto: "https://cdn2.thecatapi.com/images/4d3.jpg",
    edad: "5 años",
    tamano: "Grande",
    especie: "Gato",
    genero: "Macho",
    vacunado: true,
    esterilizado: true,
    veces_adoptado: 1,
    tiempo_en_refugio: "6 meses",
    discapacidad: false,
    descripcion: "Simba es un gato tranquilo y curioso, le encanta observar por la ventana.",
    personalidad: "Tranquilo, observador y sociable",
    posee_descendencia: true,
    fecha_ingreso: "2025-03-15",
    requisitos_adopcion: "Hogar con espacio amplio y paciencia",
    vacunas: [
      { id: "v5", nombre: "Triple felina", fecha_aplicacion: "2025-03-20", proxima_dosis: "2026-03-20" }
    ],
    historial_clinico: [
      { id: "h5", fecha: "2025-03-18", descripcion: "Chequeo general, se encuentra saludable.", veterinario: "Dra. Soto", tratamiento: "Ninguno" }
    ]
  }
];


export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SwipeCards pets={pets} />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]} onPress={() => {}}>
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]} onPress={() => {}}>
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Favorito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]} onPress={() => {}}>
          <Text style={{ color: theme.colors.secondary, fontWeight: "bold" }}>Siguiente</Text>
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
