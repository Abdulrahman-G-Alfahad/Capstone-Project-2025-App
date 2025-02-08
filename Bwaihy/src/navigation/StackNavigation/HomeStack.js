import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../../screens/Home/Dashboard";
import FamilyTies from "../../components/FamilyTies";
import Transactions from "../../components/Transactions";
import QRCode from "../../screens/Home/QRCode";
import AddBeneficiary from "../../screens/Home/AddBeneficiary";
import Profile from "../../screens/Auth/Profile";
import FamilyTieDetails from "../../screens/Home/FamilyTieDetails";
import Promotions from "../../screens/Home/Promotions";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="FamilyTies" component={FamilyTies} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="QRCode" component={QRCode} />
      <Stack.Screen name="AddBeneficiary" component={AddBeneficiary} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen
        name="FamilyTieDetails"
        component={FamilyTieDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Promotions" component={Promotions} />
    </Stack.Navigator>
  );
};

export default HomeStack;
