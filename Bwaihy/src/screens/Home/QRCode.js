import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const QRCode = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>QR Code</Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <Ionicons name="construct-outline" size={80} color="#A78BFA" />
          <Text style={styles.messageTitle}>🚧 Under Construction 🚧</Text>
          <Text style={styles.messageText}>
            Our QR code wizards are hard at work brewing up something magical!
            ✨
          </Text>
          <Text style={styles.subText}>
            Check back soon for an awesome QR experience! 🌟
          </Text>
        </ScrollView>
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
    backgroundColor: "#141E30",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    paddingBottom: 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 8,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
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

export default QRCode;
