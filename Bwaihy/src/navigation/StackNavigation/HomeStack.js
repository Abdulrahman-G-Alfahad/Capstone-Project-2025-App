import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../../screens/Home/Dashboard";
import FamilyTies from "../../components/FamilyTies";
import Transactions from "../../components/Transactions";
import QRCode from "../../components/QRCode";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="FamilyTies" component={FamilyTies} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="QRCode" component={QRCode} />
    </Stack.Navigator>
  );
};

export default HomeStack;
