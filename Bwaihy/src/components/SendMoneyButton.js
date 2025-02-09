import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SendMoneyButton = () => {
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!recipientName.trim()) {
      newErrors.recipientName = "Recipient name is required";
    }
    if (!sendAmount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(sendAmount) || Number(sendAmount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [recipientName, sendAmount]);

  const isFormValid =
    recipientName.trim() &&
    sendAmount.trim() &&
    !isNaN(sendAmount) &&
    Number(sendAmount) > 0;

  const handleSendMoney = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      // Add your send money logic here
      setSendModalVisible(false);
      setSendAmount("");
      setRecipientName("");
      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.actionButton, styles.sendButton]}
        onPress={() => setSendModalVisible(true)}
      >
        <MaterialCommunityIcons
          name="send-circle-outline"
          size={24}
          color="#E8F0FE"
        />
        <Text style={styles.actionButtonText}>Send Money</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={sendModalVisible}
        onRequestClose={() => setSendModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setSendModalVisible(false);
                setSendAmount("");
                setRecipientName("");
                setErrors({});
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close-circle" size={28} color="#9991b1" />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Money</Text>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Recipient Name"
                  placeholderTextColor="#8e8ba7"
                  value={recipientName}
                  onChangeText={setRecipientName}
                />
              </View>
              {errors.recipientName && (
                <Text style={styles.errorText}>{errors.recipientName}</Text>
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="wallet-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Amount"
                  placeholderTextColor="#8e8ba7"
                  value={sendAmount}
                  onChangeText={setSendAmount}
                  keyboardType="numeric"
                />
              </View>
              {errors.amount && (
                <Text style={styles.errorText}>{errors.amount}</Text>
              )}

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  !isFormValid && styles.modalButtonDisabled,
                ]}
                onPress={handleSendMoney}
                disabled={!isFormValid}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    !isFormValid && styles.modalButtonTextDisabled,
                  ]}
                >
                  Send
                </Text>
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
  sendButton: {
    backgroundColor: "#5B21B6",
    fontWeight: "700",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
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
    shadowColor: "#5B21B6",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: "rgba(91, 33, 182, 0.2)",
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
    backgroundColor: "rgba(91, 33, 182, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(91, 33, 182, 0.2)",
  },
  modalInput: {
    flex: 1,
    color: "#E8F0FE",
    fontSize: 16,
    marginLeft: 10,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#5B21B6",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#5B21B6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
  },
  modalButtonDisabled: {
    backgroundColor: "rgba(91, 33, 182, 0.3)",
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
    color: "#5B21B6",
    fontSize: 12,
    marginBottom: 12,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
};

export default SendMoneyButton;
