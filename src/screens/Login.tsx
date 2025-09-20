import { useTheme } from "../theme/ThemeContext";
import { View, Text } from "react-native";

export default function LoginScreen() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',     
      }}
    >
      <Text style={{ color: theme.colors.secondary, textAlign: 'center' }}>
        login funciona
      </Text>
    </View>
  );
}
