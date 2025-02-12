import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UserContext from "../context/UserContext";
import { getFamily, setLimit } from "../api/family";
import { getToken } from "../api/storage";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";

const SendMoneyButton = () => {
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState("");
  const { user } = useContext(UserContext);

  console.log(selectedMember);

  useEffect(() => {
    if (sendModalVisible) {
      fetchFamilyMembers();
    }
  }, [sendModalVisible]);

  const fetchFamilyMembers = async () => {
    try {
      const token = await getToken();
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const response = await getFamily(userId);
        setProfile(userId);
        setFamilyMembers(response.familyMembers);
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  const sendMoney = useMutation({
    mutationFn: (amount) => setLimit(profile, amount, selectedMember.id),
    onSuccess: (data) => {
      console.log("Limit set successfully:", data);
      setSendModalVisible(false);
      setSendAmount("");
      setSelectedMember(null);
      // Handle success, e.g., update state or show a success message
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!selectedMember) {
      newErrors.recipient = "Please select a recipient";
    }
    if (!sendAmount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(sendAmount) || Number(sendAmount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedMember, sendAmount]);

  const isFormValid =
    selectedMember &&
    sendAmount.trim() &&
    !isNaN(sendAmount) &&
    Number(sendAmount) > 0;

  const handleSendMoney = async () => {
    console.log(profile, sendAmount, selectedMember.id);
    try {
      if (!validateForm()) {
        return;
      }
      sendMoney.mutate(Number(sendAmount));
      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  const resetModal = () => {
    setSendModalVisible(false);
    setSendAmount("");
    setSelectedMember(null);
    setDropdownVisible(false);
    setErrors({});
  };

  const getInputContainerStyle = () => {
    return [
      styles.inputContainer,
      dropdownVisible && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        borderColor: "#0D9488",
      },
    ];
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
        <Text style={styles.actionButtonText}>Set Deposit</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={sendModalVisible}
        onRequestClose={resetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={resetModal} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#9991b1" />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Deposit</Text>
            </View>

            <View style={styles.modalContent}>

              {/* Family Ties Selection */}
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={getInputContainerStyle()}
                  onPress={() => setDropdownVisible(!dropdownVisible)}
                >
                  <Ionicons name="people-outline" size={24} color="#8e8ba7" />
                  <Text
                    style={[
                      styles.modalInput,
                      !selectedMember && styles.placeholderText,
                    ]}
                  >
                    {selectedMember
                      ? selectedMember.fullName
                      : "Select Family Tie"}
                  </Text>
                  <Ionicons
                    name={dropdownVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={dropdownVisible ? "#0D9488" : "#8e8ba7"}
                  />
                </TouchableOpacity>
                {errors.recipient && (
                  <Text style={styles.errorText}>{errors.recipient}</Text>
                )}

                {dropdownVisible && (
                  <View style={styles.dropdownList}>
                    <ScrollView
                      style={styles.dropdownScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {familyMembers.map((member) => (
                        <TouchableOpacity
                          key={member.id}
                          style={[
                            styles.dropdownItem,
                            selectedMember?.id === member.id &&
                              styles.dropdownItemSelected,
                          ]}
                          onPress={() => {
                            setSelectedMember(member);
                            setDropdownVisible(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>
                            {member.fullName}
                          </Text>
                          {selectedMember?.id === member.id && (
                            <Ionicons
                              name="checkmark"
                              size={20}
                              color="#0D9488"
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                      {familyMembers.length === 0 && (
                        <View style={styles.noMembersContainer}>
                          <Text style={styles.noMembersText}>
                            No family members found
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

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

              {/* Deposit Amount Button*/}

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
    backgroundColor: "#0D9488",
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
    shadowColor: "#0D9488",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: "rgba(13, 148, 136, 0.2)",
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
    position: "relative",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A2942",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(13, 148, 136, 0.2)",
    zIndex: 1,
  },
  modalInput: {
    flex: 1,
    color: "#E8F0FE",
    fontSize: 16,
    marginLeft: 10,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#0D9488",
    padding: 18,
    marginTop: 15,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#0D9488",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
  },
  modalButtonDisabled: {
    backgroundColor: "rgba(13, 148, 136, 0.3)",
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
    color: "#0D9488",
    fontSize: 12,
    marginBottom: 12,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  dropdownContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 8,
    zIndex: 2,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    marginTop: -1,
    left: 0,
    right: 0,
    backgroundColor: "#1A2942",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    maxHeight: 200,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "rgba(13, 148, 136, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    zIndex: 3,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(13, 148, 136, 0.1)",
    backgroundColor: "#1A2942",
  },
  dropdownItemSelected: {
    backgroundColor: "rgba(13, 148, 136, 0.15)",
  },
  dropdownItemText: {
    color: "#E8F0FE",
    fontSize: 16,
    marginLeft: 34,
  },
  dropdownScroll: {
    width: "100%",
  },
  noMembersContainer: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#1A2942",
  },
  noMembersText: {
    color: "#8e8ba7",
    fontSize: 14,
  },
};

export default SendMoneyButton;
