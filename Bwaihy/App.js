import { StatusBar } from "expo-status-bar";
import { StyleSheet,View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNav from "./src/navigation/TabNavigation/TabNav";
import Login from "./src/screens/Auth/Login";
import Register from "./src/screens/Auth/Register";
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#ffff" />
      <TabNav />
      {/* <Login /> */}
      {/* <Register /> */}
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
