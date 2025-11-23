export const lightTheme = {
  mode: "light",

  colors: {
    /*NUEVOS COLORES MOOD CLARO */
    background: "#FFFFFF",
    backgroundSecondary: "#F4F4F4",
    backgroundTertiary: "#DDDDDD",
    card: "#FFFFFF",

    text: "#222222",
    textSecondary: "#aba9a9ff",

    accent: "#3CA374",

    error: "#ff0000ff",
    errorDeshabilitado: "#ff0000ff",

    success: "#2E7D32",

    border: "#CCCCCC",

    /*COMPATIBILIDAD TOTAL CON TU CÓDIGO ANTIGUO*/
    primary: "#000000ff",
    secondary: "#6D6875",

    surface: "#F5F6FA",

    overlayBackground: "rgba(0,0,0,0.4)",
    overlayText: "#ffffff",
    overlayTextShadow: "rgba(0,0,0,0.1)",
  },
};

export const darkTheme = {
  mode: "dark",

  colors: {
    /* === NUEVOS COLORES === */
    background: "#121212",
    backgroundSecondary: "#1E1E1E",
    backgroundTertiary: "#333333",
    card: "#1E1E1E",

    text: "#FFFFFF",
    textSecondary: "#B5B5B5",

    accent: "#4CAF50",

    error: "#EF5350",
    errorDeshabilitado: "#8E5050",

    success: "#66BB6A",

    border: "#444444",

    /* === COMPATIBILIDAD ANTIGUA === */
    primary: "#000000ff",
    secondary: "#7FFF00",

    surface: "#232323",

    overlayBackground: "#375a14ab",
    overlayText: "#7FFF00",
    overlayTextShadow: "#6F2DA8",
  },
};

export type Theme = typeof lightTheme | typeof darkTheme;
