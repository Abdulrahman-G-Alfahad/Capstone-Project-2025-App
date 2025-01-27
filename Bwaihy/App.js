import { StatusBar } from "expo-status-bar";
import { StyleSheet,View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNav from "./src/navigation/TabNavigation/TabNav";
import AuthNav from "./src/navigation/AuthNavigation/AuthNav";
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#ffff" />
      <TabNav />
      {/* <AuthNav /> */}
  
    </NavigationContainer>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
