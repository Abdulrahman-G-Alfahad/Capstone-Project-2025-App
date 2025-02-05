import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getToken } from "../api/storage";
import { jwtDecode } from "jwt-decode";
import { addFamily, getFamily } from "../api/family";

const AddFamilyTies = ({
  modalVisible,
  setModalVisible,
  onFamilyMemberAdded,
}) => {
  const [fullName, setFullName] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [faceId, setFaceId] = useState("");

  const handleAddFamilyMember = async () => {
    try {
      const token = await getToken();
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const familyInfo = { fullName, walletBalance, faceId };
      await addFamily(userId, familyInfo);
      const familyData = await getFamily(userId);
      onFamilyMemberAdded(familyData.familyMembers);
      setModalVisible(false);
      setFullName("");
      setWalletBalance("");
      setFaceId("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close-circle" size={28} color="#9991b1" />
          </TouchableOpacity>

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add A Family Tie</Text>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#8e8ba7" />
              <TextInput
                style={styles.modalInput}
                placeholder="Full Name"
                placeholderTextColor="#8e8ba7"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="wallet-outline" size={24} color="#8e8ba7" />
              <TextInput
                style={styles.modalInput}
                placeholder="Wallet Balance"
                placeholderTextColor="#8e8ba7"
                value={walletBalance}
                onChangeText={setWalletBalance}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="scan-outline" size={24} color="#8e8ba7" />
              <TextInput
                style={styles.modalInput}
                placeholder="Face ID"
                placeholderTextColor="#8e8ba7"
                value={faceId}
                onChangeText={setFaceId}
              />
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleAddFamilyMember}
            >
              <Text style={styles.modalButtonText}>Add Member</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});

export default AddFamilyTies;
