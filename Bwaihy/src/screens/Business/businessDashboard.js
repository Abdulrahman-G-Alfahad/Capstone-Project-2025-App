import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BusinessDashboard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Business Dashboard</Text>
      </View>
      {/* Add your sections or components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1f1d35",
    justifyContent: "center",
  },
  header: {
    marginBottom: "20%",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default BusinessDashboard;