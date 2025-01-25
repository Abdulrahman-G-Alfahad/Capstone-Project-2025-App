import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Press the page you want to visit "temp"
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Balance</Text>
      </View>

      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("FamilyTies")}
      >
        <Text style={styles.sectionTitle}>Family Ties</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("Transactions")}
      >
        <Text style={styles.sectionTitle}>Transactions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("QRCode")}
      >
        <Text style={styles.sectionTitle}>QR Code "Temp"</Text>
      </TouchableOpacity>
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
  section: {
    borderWidth: 1,
    borderColor: "#ffffff50",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
});

export default Dashboard;
