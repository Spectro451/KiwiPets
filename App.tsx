import { ThemeProvider } from "./src/theme/ThemeContext";
import BottomTabs from "./src/navigation/Tabs";

export default function App() {
  return (
    <ThemeProvider>
      <BottomTabs/>
    </ThemeProvider>
  );
}
