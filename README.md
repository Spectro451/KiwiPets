# KiwiPets

Aplicación móvil híbrida inspirada en el estilo de navegación tipo "Tinder", diseñada para facilitar la adopción de mascotas.  
El objetivo es mostrar de manera sencilla las mascotas disponibles en centros de adopción cercanos, permitiendo que los centros se comuniquen más fácilmente con los interesados en adoptar.

---

## Características principales
- Registro e inicio de sesión (adoptantes y refugios).
- Listado de mascotas disponibles en tu área.
- Perfiles de mascotas con información detallada.
- Gestión de mascotas por parte de refugios (publicación, edición, fotos, historial clínico).
- Sistema de exploración tipo swipe para adoptantes.
- Envío y gestión de solicitudes de adopción.
- Función de favoritos para marcar mascotas de interés.
- Notificaciones de estado de solicitudes y novedades.

---

## Tecnologías utilizadas
- **Frontend móvil**: React Native + Expo  
- **Navegación**: React Navigation (Bottom Tabs + Stack)  
- **Gestos y animaciones**: React Native Reanimated, Gesture Handler  
- **Base de datos**: MySQL (con XAMPP)  
- **Comunicación**: Axios  
- **Almacenamiento local**: AsyncStorage  
- **Extras**: Expo Image Picker, Expo Location, Expo Notifications  

---

## Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/adopcion-mascotas.git
cd adopcion-mascotas

# Instalar dependencias
npm install

# Levantar el proyecto
npx expo start

