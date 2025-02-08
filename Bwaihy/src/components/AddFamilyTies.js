import React, { useState, useCallback } from "react";
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
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!walletBalance.trim()) {
      newErrors.walletBalance = "Wallet balance is required";
    } else if (isNaN(walletBalance) || Number(walletBalance) < 0) {
      newErrors.walletBalance = "Please enter a valid amount";
    }
    if (!faceId.trim()) {
      newErrors.faceId = "Face ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fullName, walletBalance, faceId]);

  const isFormValid = fullName.trim() && walletBalance.trim() && faceId.trim();

  const handleAddFamilyMember = async () => {
    try {
      if (!validateForm()) {
        return;
      }

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
      setErrors({});
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
            onPress={() => {
              setModalVisible(false);
              setErrors({});
              setFullName("");
              setWalletBalance("");
              setFaceId("");
            }}
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
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}

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
            {errors.walletBalance && (
              <Text style={styles.errorText}>{errors.walletBalance}</Text>
            )}

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
            {errors.faceId && (
              <Text style={styles.errorText}>{errors.faceId}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.modalButton,
                !isFormValid && styles.modalButtonDisabled,
              ]}
              onPress={handleAddFamilyMember}
              disabled={!isFormValid}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  !isFormValid && styles.modalButtonTextDisabled,
                ]}
              >
                Add Member
              </Text>
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
    backgroundColor: "rgba(20, 30, 48, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#1A2942",
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
    color: "#E8F0FE",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  modalInput: {
    flex: 1,
    color: "#E8F0FE",
    fontSize: 16,
    marginLeft: 10,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#A78BFA",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
  },
  modalButtonDisabled: {
    backgroundColor: "rgba(167, 139, 250, 0.3)",
    shadowOpacity: 0,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  modalButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  errorText: {
    color: "#FF4F8E",
    fontSize: 12,
    marginBottom: 12,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
});

export default AddFamilyTies;
