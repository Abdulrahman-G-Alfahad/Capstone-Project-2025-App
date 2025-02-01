import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { beneficiaryData } from "../data/beneficiaryData";

const getInitials = (name) => {
  const names = name.split(" ");
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
};

// Make the Avatar color different based on the Accounts privacy ? if private make it same as the current color
// if public make it "#FF6E40", // Deep orange

// "#FF4F6D", // Primary pink
// "#5066C0", // Primary blue
// "#7C4DFF", // Deep purple
// "#00BFA5", // Teal
// "#FF6E40", // Deep orange
// "#448AFF", // Light blue

const LetterAvatar = ({ name }) => {
  const initials = getInitials(name);
  const backgroundColor = "#5066C0";

  return (
    <View style={[styles.avatar, { backgroundColor }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
};

const FamilyTies = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("0");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState(beneficiaryData);

  const handleAddBeneficiary = () => {
    if (!username.trim()) {
      return;
    }

    const newBeneficiary = {
      id: (beneficiaries.length + 1).toString(),
      name: username,
      relationship: "Friend",
      dateAdded: new Date().toISOString().split("T")[0],
    };

    setBeneficiaries([...beneficiaries, newBeneficiary]);
    setUsername("");
    setIsModalVisible(false);
  };

  const handleSendMoney = () => {
    // implement the actual money sending logic Here later "API
    console.log(`Sending ${amount} to ${selectedBeneficiary.name}`);
    setAmount("0");
    setSelectedBeneficiary(null);
    setIsSendModalVisible(false);
  };

  const handleIncrement = () => {
    const currentAmount = parseFloat(amount) || 0;
    setAmount((currentAmount + 1).toString());
  };

  const handleDecrement = () => {
    const currentAmount = parseFloat(amount) || 0;
    if (currentAmount > 0) {
      setAmount((currentAmount - 1).toString());
    }
  };

  const handleAmountChange = (text) => {
    setAmount(text);
  };

  const handleDelete = () => {
    if (selectedBeneficiary) {
      const updatedBeneficiaries = beneficiaries.filter(
        (b) => b.id !== selectedBeneficiary.id
      );
      setBeneficiaries(updatedBeneficiaries);
      setSelectedBeneficiary(null);
      setIsDeleteModalVisible(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) =>
    beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBeneficiary = ({ item }) => (
    <View style={styles.beneficiaryCard}>
      <View style={styles.beneficiaryMainContent}>
        <LetterAvatar name={item.name} />
        <View style={styles.beneficiaryInfo}>
          <Text style={styles.beneficiaryName}>{item.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setSelectedBeneficiary(item);
            setIsDeleteModalVisible(true);
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4F6D" />
        </TouchableOpacity>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            setSelectedBeneficiary(item);
            setIsSendModalVisible(true);
          }}
        >
          <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
          <Text style={styles.sendButtonText}>Send Money</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Ties</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Family Ties ..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredBeneficiaries}
        renderItem={renderBeneficiary}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
      />

      {/* Add Beneficiary Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Beneficiary</Text>
            <Text style={styles.modalSubtitle}>
              Enter the username of the person you want to add to your Family
              Ties
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !username.trim() && styles.confirmButtonDisabled,
              ]}
              onPress={handleAddBeneficiary}
              disabled={!username.trim()}
            >
              <Text style={styles.confirmButtonText}>Add Beneficiary</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setUsername("");
                setIsModalVisible(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Send Money Modal */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isSendModalVisible}
        onRequestClose={() => setIsSendModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Money</Text>
            <Text style={styles.modalSubtitle}>
              Enter the amount you want to send to {selectedBeneficiary?.name}
            </Text>

            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="0.0"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!amount.trim() || parseFloat(amount) === 0) &&
                  styles.confirmButtonDisabled,
              ]}
              onPress={handleSendMoney}
              disabled={!amount.trim() || parseFloat(amount) === 0}
            >
              <Text style={styles.confirmButtonText}>Send KD {amount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setAmount("0");
                setSelectedBeneficiary(null);
                setIsSendModalVisible(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Beneficiary Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Beneficiary</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to delete {selectedBeneficiary?.name} from
              your Family Ties? This action cannot be undone.
            </Text>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: "#FF4F6D" }]}
              onPress={handleDelete}
            >
              <Text style={styles.confirmButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setSelectedBeneficiary(null);
                setIsDeleteModalVisible(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Beneficiary Button */}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1d35",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#1f1d35",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2844",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 52,
    padding: 8,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2844",
    margin: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
    color: "#666",
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: "#fff",
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  list: {
    flex: 1,
  },
  beneficiaryCard: {
    backgroundColor: "#2a2844",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  beneficiaryMainContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  beneficiaryInfo: {
    marginLeft: 16,
    flex: 1,
  },
  beneficiaryName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2a2844",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#383454",
    paddingTop: 12,
  },
  sendButton: {
    backgroundColor: "#FF4F6D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#FF4F6D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 24,
    backgroundColor: "#448AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#448AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "30%",
  },
  modalContent: {
    backgroundColor: "#1f1d35",
    borderRadius: 24,
    padding: 32,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#9991b1",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
    maxWidth: 300,
  },
  modalInput: {
    width: "100%",
    height: 56,
    borderWidth: 1.5,
    borderColor: "#383454",
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 17,
    marginBottom: 32,
    color: "#fff",
    backgroundColor: "#2a2844",
  },
  confirmButton: {
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
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: "#ffb3c1",
    shadowOpacity: 0.1,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  cancelButton: {
    width: "100%",
    padding: 12,
    marginTop: 4,
  },
  cancelButtonText: {
    color: "#9991b1",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  amountInput: {
    width: "100%",
    height: 56,
    borderWidth: 1.5,
    borderColor: "#383454",
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 24,
    marginBottom: 32,
    color: "#fff",
    backgroundColor: "#2a2844",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default FamilyTies;
