import React from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FaceIDSetup = ({ isVisible, onClose, onConfirm, mode = "enroll" }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === "enroll" ? "Set Up Face ID" : "Face ID Authentication"}
          </Text>
          <Text style={styles.modalSubtitle}>
            {mode === "enroll"
              ? "Please set up Face ID for secure authentication."
              : "Please authenticate using Face ID."}
          </Text>

          <View style={styles.faceIDIconContainer}>
            <Ionicons name="scan-outline" size={80} color="#FF4F6D" />
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>
              {mode === "enroll" ? "Enable Face ID" : "Authenticate"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 30, 48, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#141E30",
    borderRadius: 24,
    padding: 32,
    width: "90%",
    alignItems: "center",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E8F0FE",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "rgba(232, 240, 254, 0.6)",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: "500",
  },
  faceIDIconContainer: {
    marginVertical: 24,
    alignItems: "center",
    backgroundColor: "rgba(255, 79, 142, 0.1)",
    padding: 24,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "rgba(255, 79, 142, 0.2)",
  },
  confirmButton: {
    width: "100%",
    backgroundColor: "#FF4F8E",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#FF4F8E",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  confirmButtonText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  cancelButton: {
    width: "100%",
  },
  cancelButtonText: {
    color: "rgba(232, 240, 254, 0.6)",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default FaceIDSetup;
