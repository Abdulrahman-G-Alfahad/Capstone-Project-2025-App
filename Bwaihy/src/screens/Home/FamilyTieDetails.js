import React, { useState } from "react";
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
import businesses from "../../data/businessesData";

const FamilyTieDetails = ({ route, navigation }) => {
  const { member } = route.params;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [amount, setAmount] = useState("");

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleSendMoney = () => {
    setShowSendMoneyModal(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete functionality
    setShowDeleteModal(false);
    navigation.goBack();
  };

  const confirmSendMoney = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }
    // TODO: Implement send money functionality
    navigation.navigate("SendMoney", {
      recipient: member,
      amount: parseFloat(amount),
    });
    setShowSendMoneyModal(false);
    setAmount("");
  };

  console.log(member);
  // Transform businesses data into transactions format
  const transactions = businesses.map((business) => ({
    id: business.id,
    business: business.name,
    date: moment().subtract(business.id, "days").format("YYYY-MM-DD"),
    amount: -(Math.random() * 50).toFixed(2),
    icon: business.icon,
  }));

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
            <Ionicons name="trash-outline" size={24} color="#FF4F6D" />
          </TouchableOpacity>
        </View>

        {/* Tie Card */}
        <View style={styles.memberCard}>
          <Avatar
            source={member.photo}
            name={member.fullName}
            size={80}
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
              <Text style={styles.balanceValue}>50 KD</Text>
            </View>
            <Text style={styles.balanceDivider}>/</Text>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Remaining Balance</Text>
              <Text style={styles.balanceValue}>15 KD</Text>
            </View>
          </View>

          {/* Send Money Button */}
          <TouchableOpacity
            style={styles.sendMoneyButton}
            onPress={handleSendMoney}
          >
            <View style={styles.sendMoneyIconContainer}>
              <Ionicons name="send" size={20} color="#fff" />
            </View>
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
          onRequestClose={() => setShowSendMoneyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Send Money</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowSendMoneyModal(false);
                    setAmount("");
                  }}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#9991b1" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>
                Enter amount to send to{" "}
                <Text style={styles.highlightedText}>{member.fullName}</Text>
              </Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencyText}>KD</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#9991b1"
                  autoFocus
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowSendMoneyModal(false);
                    setAmount("");
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmSendMoney}
                >
                  <Text style={styles.confirmButtonText}>Send</Text>
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
                <Text style={styles.highlightedText}>{member.fullName}</Text>{" "}
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
    backgroundColor: "#1f1d35",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  memberCard: {
    backgroundColor: "#2a2844",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: "#5066C0",
    borderColor: "#5066C0",
  },
  memberName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  transactionDate: {
    color: "#9991b1",
    fontSize: 14,
    marginBottom: 24,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  balanceItem: {
    flex: 1,
    alignItems: "center",
  },
  balanceLabel: {
    color: "#9991b1",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  balanceDivider: {
    color: "#9991b1",
    fontSize: 24,
    marginHorizontal: 16,
  },
  transactionSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2844",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionInfo: {
    marginLeft: 12,
  },
  businessName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionAmount: {
    color: "#FF4F6D",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    marginLeft: "auto",
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: "#2a2844",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  modalText: {
    color: "#9991b1",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  highlightedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: "auto",
    paddingTop: 12,
    marginBottom: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#3d3956",
  },
  confirmButton: {
    backgroundColor: "#FF4F6D",
  },
  cancelButtonText: {
    color: "#9991b1",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sendMoneyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3d3956",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 24,
  },
  sendMoneyIconContainer: {
    marginRight: 8,
  },
  sendMoneyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
    gap: 8,
  },
  currencyText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  amountInput: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    minWidth: 120,
    borderBottomWidth: 2,
    borderBottomColor: "#5066C0",
    paddingBottom: 8,
  },
});

export default FamilyTieDetails;
