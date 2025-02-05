import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { makeDeposit } from "../api/transactions";
import { getToken } from "../api/storage";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "../api/auth";

const AddMoneyButton = ({ onSuccess }) => {
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const handleMakeDeposit = async () => {
    try {
      const token = await getToken();
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      await makeDeposit(userId, { amount: depositAmount });
      const profileData = await getProfile(userId);
      onSuccess(profileData.user);
      setDepositModalVisible(false);
      setDepositAmount("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.actionButton, styles.addButton]}
        onPress={() => setDepositModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" weight="bold" />
        <Text style={styles.actionButtonText}>Add</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={depositModalVisible}
        onRequestClose={() => setDepositModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setDepositModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close-circle" size={28} color="#9991b1" />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Balance</Text>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Ionicons name="wallet-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Amount"
                  placeholderTextColor="#8e8ba7"
                  value={depositAmount}
                  onChangeText={setDepositAmount}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleMakeDeposit}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = {
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButton: {
    backgroundColor: "#FF4F6D",
    fontWeight: "700",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(31, 29, 53, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#2a2844",
    borderRadius: 24,
    padding: 32,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  modalHeader: {
    width: "100%",
    marginBottom: 24,
    paddingTop: 8,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(255, 79, 109, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(31, 29, 53, 0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#FF4F6D",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#FF4F6D",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
};

export default AddMoneyButton;
