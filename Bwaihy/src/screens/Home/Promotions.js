import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Promotions = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Promotions</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.emptyStateContainer}>
            <Ionicons name="sparkles-outline" size={80} color="#A78BFA" />
            <Text style={styles.messageTitle}>🎁 Coming Soon! 🎁</Text>
            <Text style={styles.messageText}>
              Hold onto your wallets! We're cooking up some incredible deals
              just for you! 🪄
            </Text>
            <Text style={styles.subText}>
              Our deal hunters 🎯 are working hard to get you amazing offers!✨
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  backButton: {
    padding: 8,
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  emptyStateContainer: {
    alignItems: "center",
    padding: 32,
  },
  messageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E8F0FE",
    marginTop: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  messageText: {
    fontSize: 18,
    color: "#A78BFA",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 28,
    fontWeight: "600",
    paddingHorizontal: 20,
  },
  subText: {
    fontSize: 16,
    color: "#A78BFA",
    textAlign: "center",
    opacity: 0.8,
    fontWeight: "500",
    paddingHorizontal: 20,
  },
});

export default Promotions;
