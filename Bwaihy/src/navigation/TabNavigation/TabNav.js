import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import screens
import Dashboard from "../../screens/Home/Dashboard";
import NFC from "../../screens/Home/NFC";
import Profile from "../../screens/Auth/Profile";

const Tab = createBottomTabNavigator();

const TabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#FF4F6D",
        tabBarInactiveTintColor: "#8B8EBE", //change from this to#48497F 
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "view-dashboard-outline";
          } else if (route.name === "NFC") {
            iconName = "nfc";
          } else if (route.name === "Profile") {
            iconName = "account";
          }

          return (
            <View style={styles.iconContainer}>
              {focused && (
                <View style={[styles.indicator, { backgroundColor: color }]} />
              )}
              <Icon name={iconName} size={24} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="NFC" component={NFC} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#151425",
    paddingTop: 8,
    // paddingBottom: 20,
    height: 80,
    position: "absolute",
  },
  tabLabel: {
    fontSize: 13,
    marginTop: 2,
    // marginBottom: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
  indicator: {
    height: 4,
    width: "280%",
    position: "absolute",
    top: -15,
    // borderRadius: 1,
  },
});

export default TabNav;
