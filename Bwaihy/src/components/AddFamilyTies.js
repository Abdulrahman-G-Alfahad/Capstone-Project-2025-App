import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getToken } from "../api/storage";
import { jwtDecode } from "jwt-decode";
import { addFamily, getFamily } from "../api/family";
import FaceID from "./FaceID";

const AddFamilyTies = ({
  modalVisible,
  setModalVisible,
  onFamilyMemberAdded,
}) => {
  const [fullName, setFullName] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [faceId, setFaceId] = useState("");
  const [errors, setErrors] = useState({});
  const [showFaceID, setShowFaceID] = useState(false);

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

  const handleFaceIDPress = () => {
    console.log("Face ID button pressed");
    setShowFaceID(true);
  };

  const handleFaceIDSuccess = (data) => {
    console.log("Face ID success:", data);
    setFaceId(data.facialId);
    setShowFaceID(false);
    Alert.alert("Success", "Face ID has been set successfully!");
  };

  const handleFaceIDClose = () => {
    console.log("Face ID modal closed");
    setShowFaceID(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Family Member</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#E8F0FE" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#8e8ba7" />
              <TextInput
                style={styles.input}
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
                style={styles.input}
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

            <TouchableOpacity
              style={[styles.faceIdButton]}
              onPress={handleFaceIDPress}
            >
              <Ionicons name="scan-outline" size={24} color="#E8F0FE" />
              <Text style={styles.faceIdButtonText}>
                {faceId ? "Face ID Set ✓" : "Set Up Face ID"}
              </Text>
            </TouchableOpacity>
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

      <FaceID
        isVisible={showFaceID}
        onClose={handleFaceIDClose}
        onSuccess={handleFaceIDSuccess}
        userData={{
          email: "family@member.com",
          username: fullName || "Family Member",
          fullName: fullName || "Family Member",
        }}
        mode="enroll"
        setFaceId={setFaceId}
      />
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
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E8F0FE",
  },
  closeButton: {
    padding: 8,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(142, 139, 167, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#E8F0FE",
    paddingVertical: 16,
    marginLeft: 12,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: "#FF4F8E",
    padding: 18,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#FF4F8E",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
  },
  modalButtonDisabled: {
    backgroundColor: "rgba(255, 79, 142, 0.5)",
    shadowOpacity: 0,
  },
  modalButtonText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  modalButtonTextDisabled: {
    color: "rgba(232, 240, 254, 0.5)",
  },
  errorText: {
    color: "#FF4F8E",
    fontSize: 12,
    marginBottom: 12,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  faceIdButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4F8E",
    padding: 18,
    borderRadius: 16,
    marginTop: 15,
    marginBottom: 8,
    shadowColor: "#FF4F8E",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
  },
  faceIdButtonText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },
});

export default AddFamilyTies;
