import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BusinessIcon from "../../components/BusinessIcon";
import Avatar from "../../components/Avatar";
import moment from "moment";
import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteFamily, setLimit } from "../../api/family";

const FamilyTieDetails = ({ route, navigation }) => {
  const { member, profile } = route.params;
  const [memberProfile, setMemberProfile] = useState(member);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});

  const deleteMutation = useMutation({
    mutationFn: (memberId) => deleteFamily(profile.id, memberId),
    onSuccess: () => {
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const setLimitMutation = useMutation({
    mutationFn: (limit) => setLimit(profile.id, limit, memberProfile.id),
    onSuccess: (data) => {
      setMemberProfile(data.familyMember);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleSendMoney = () => {
    setShowSendMoneyModal(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(memberProfile.id);
    setShowDeleteModal(false);
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amount) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount]);

  const isFormValid = amount.trim() && !isNaN(amount) && Number(amount) > 0;

  const confirmSendMoney = () => {
    if (!validateForm()) {
      return;
    }
    setLimitMutation.mutate(parseFloat(amount));
    setShowSendMoneyModal(false);
    setAmount("");
    setErrors({});
  };

  // console.log(memberProfile);
  // Transform businesses data into transactions format
  const transactions = memberProfile.transactions.map((transaction) => ({
    id: transaction.id,
    business: transaction.businessName,
    date: moment(transaction.date).format("YYYY-MM-DD"),
    amount: transaction.amount,
    icon: transaction.icon,
  }));

  const totalSent = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const remainingBalance = memberProfile.walletBalance - totalSent;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Family Ties</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="#A78BFA" />
          </TouchableOpacity>
        </View>

        {/* Tie Card */}
        <View style={styles.memberCard}>
          <Avatar
            source={memberProfile.photo}
            name={memberProfile.fullName}
            size={65}
            style={styles.avatar}
          />
          <Text style={styles.memberName}>{member.fullName}</Text>
          <Text style={styles.transactionDate}>
            Transaction on {moment().format("MMMM D, YYYY")}
          </Text>

          {/* Balance Information */}
          <View style={styles.balanceContainer}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Amount Sent</Text>
              <Text style={styles.balanceValue}>KD {totalSent.toFixed(2)}</Text>
            </View>
            <View style={styles.balanceSeparator} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Remaining Balance</Text>
              <Text style={styles.balanceValue}>
                KD {remainingBalance.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Send Money Button */}
          <TouchableOpacity
            style={styles.sendMoneyButton}
            onPress={handleSendMoney}
          >
            <Ionicons name="wallet-outline" size={24} color="#fff" />
            <Text style={styles.sendMoneyText}>Send Money</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionSection}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <ScrollView
            style={styles.transactionList}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <BusinessIcon businessName={transaction.business} />
                  <View style={styles.transactionInfo}>
                    <Text style={styles.businessName}>
                      {transaction.business}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {moment(transaction.date).format("MMMM D, YYYY")}
                    </Text>
                  </View>
                </View>
                <Text style={styles.transactionAmount}>
                  {transaction.amount.toFixed(2)} KD
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Send Money Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSendMoneyModal}
          onRequestClose={() => {
            setShowSendMoneyModal(false);
            setAmount("");
            setErrors({});
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => {
                  setShowSendMoneyModal(false);
                  setAmount("");
                  setErrors({});
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#9991b1" />
              </TouchableOpacity>

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Send Money</Text>
              </View>

              <View style={styles.modalContent}>
                <View style={styles.inputContainer}>
                  <Ionicons name="wallet-outline" size={24} color="#8e8ba7" />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Amount"
                    placeholderTextColor="#8e8ba7"
                    value={amount}
                    onChangeText={setAmount}
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
                  onPress={confirmSendMoney}
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

        {/* Delete Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Delete Family Tie</Text>
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#9991b1" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>
                Are you sure you want to remove{" "}
                <Text style={styles.highlightedText}>
                  {memberProfile.fullName}
                </Text>{" "}
                from your family ties?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.2)",
    paddingBottom: 16,
    position: "relative",
  },
  backButton: {
    padding: 8,
    position: "absolute",
    left: 0,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E8F0FE",
    letterSpacing: 0.5,
    flex: 1,
    textAlign: "center",
  },
  deleteButton: {
    padding: 8,
    position: "absolute",
    right: 0,
    zIndex: 1,
  },
  memberCard: {
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#A78BFA",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  memberName: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  transactionDate: {
    color: "#A78BFA",
    fontSize: 12,
    marginBottom: 12,
    fontWeight: "500",
  },
  balanceContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.03)",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  balanceItem: {
    flex: 1,
    alignItems: "center",
  },
  balanceSeparator: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    marginHorizontal: 16,
  },
  balanceLabel: {
    color: "#8e8ba7",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  balanceValue: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
  },
  transactionSection: {
    flex: 1,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#E8F0FE",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionInfo: {
    marginLeft: 12,
  },
  businessName: {
    color: "#E8F0FE",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  transactionAmount: {
    color: "#A78BFA",
    fontSize: 16,
    fontWeight: "700",
  },
  sendMoneyButton: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A78BFA",
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  sendMoneyText: {
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
    color: "#FF4F6D",
    fontSize: 14,
    marginBottom: 16,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  modalText: {
    color: "#A78BFA",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
    fontWeight: "500",
  },
  highlightedText: {
    color: "#E8F0FE",
    fontWeight: "700",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  confirmButton: {
    backgroundColor: "#A78BFA",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  cancelButtonText: {
    color: "#A78BFA",
    fontSize: 16,
    fontWeight: "700",
  },
  confirmButtonText: {
    color: "#E8F0FE",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default FamilyTieDetails;
