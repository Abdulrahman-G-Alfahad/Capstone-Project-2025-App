import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../../screens/Auth/Login";
import Register from "../../screens/Auth/Register";
import Profile from "../../screens/Auth/Profile";

const Stack = createStackNavigator();

const AuthNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default AuthNav;
