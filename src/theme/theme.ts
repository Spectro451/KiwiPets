export const lightTheme = {
  colors: {
    background: "#FFF8E7",          
    backgroundSecondary: "#FFFFFF",  
    backgroundTertiary: "#FFD166",   
    surface: "#F5F6FA",             
    primary: "#000000ff",             
    secondary: "#6D6875",        
    accent: "#4FC3F7",                       
    text: "#000000ff",             
    textSecondary: "#555",           
    overlayBackground: "rgba(0,0,0,0.4)",
    overlayText: "#ffffffff",
    overlayTextShadow: "rgba(0,0,0,0.1)",
    error: "#ff0000ff",
  },
};
export type Theme = typeof lightTheme | typeof darkTheme;

export const darkTheme = {
  colors: {
    background: "#181818",
    backgroundSecondary: "#3b3b3b65",
    backgroundTertiary: "#6F2DA8",
    surface: "#232323",
    primary: "#000000ff",              
    secondary: "#7FFF00",            
    accent: "#6F2DA8",               
    text: "#b8b8b8",
    textSecondary: "#7FFF00",
    overlayBackground: "#375a14ab",
    overlayText: "#7FFF00",
    overlayTextShadow: "#6F2DA8",
    error: "#ff0000ff",
  },
};