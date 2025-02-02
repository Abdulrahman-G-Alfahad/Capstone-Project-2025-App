import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNav from "./src/navigation/TabNavigation/TabNav";
import AuthNav from "./src/navigation/AuthNavigation/AuthNav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getToken } from "./src/api/storage";
import UserContext from "./src/context/UserContext";
import AccountContext from "./src/context/AccountContext";
import BusinessDashboard from "./src/screens/Business/businessDashboard";
import jwtDecode from "jwt-decode";

export default function App() {
  const queryClient = new QueryClient();
  const [user, setUser] = useState(false);
  const [accountType, setAccountType] = useState("");

  const checkToken = async () => {
    const token = await getToken();
    if (token) {
      setUser(true);
      const decodedToken = jwtDecode(token);
      setAccountType(decodedToken.accountType);
      console.log("Decoded account type:", decodedToken.accountType);
    } else {
      console.log("No token found");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const renderDashboard = () => {
    console.log("Current account type:", accountType);
    if (accountType === "PersonalEntity") {
      return <TabNav />;
    } else if (accountType === "BusinessEntity" || accountType === "AssociateEntity") {
      return <BusinessDashboard />;
    }
  };

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ user, setUser }}>
          <AccountContext.Provider value={{ accountType, setAccountType }}>
            <StatusBar style="light" backgroundColor="#ffff" />
            {user ? renderDashboard() : <AuthNav />}
          </AccountContext.Provider>
        </UserContext.Provider>
      </QueryClientProvider>
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