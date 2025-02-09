import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UserContext from "../context/UserContext";
import { getFamily } from "../api/family";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../api/storage";
import AddFamilyTies from "./AddFamilyTies";

const getInitials = (name) => {
  if (!name) return ""; // Return empty string if name is undefined or null
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

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials || "?"}</Text>
    </View>
  );
};

const FamilyTies = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, [user]);

  const fetchFamilyMembers = async () => {
    try {
      const token = await getToken();
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const response = await getFamily(userId);
        setFamilyMembers(response.familyMembers);
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBeneficiaries = familyMembers.filter((beneficiary) =>
    beneficiary.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBeneficiary = ({ item }) => (
    <TouchableOpacity
      style={styles.beneficiaryCard}
      onPress={() => navigation.navigate("FamilyTieDetails", { member: item })}
    >
      <View style={styles.beneficiaryMainContent}>
        <LetterAvatar name={item?.fullName} />
        <View style={styles.beneficiaryInfo}>
          <Text style={styles.beneficiaryName}>
            {item?.fullName || "Unknown"}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#9991b1"
          style={styles.chevronIcon}
        />
      </View>
    </TouchableOpacity>
  );

  const handleFamilyMemberAdded = (updatedMembers) => {
    setFamilyMembers(updatedMembers);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Ties</Text>
      </View>

      {/* Search Bar */}
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

      {/* Family Members List */}
      {familyMembers.length === 0 && !isLoading ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="people-outline" size={48} color="#9991b1" />
          <Text style={styles.emptyMessage}>No Family Ties Yet</Text>
          <Text style={styles.emptySubMessage}>
            Add your family members to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBeneficiaries}
          renderItem={renderBeneficiary}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
      )}

      {/* Add Family Member Modal */}
      <AddFamilyTies
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        onFamilyMemberAdded={handleFamilyMemberAdded}
      />

      {/* Add Family Member Button */}
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
    backgroundColor: "#141E30",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
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
    color: "#E8F0FE",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    margin: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  searchIcon: {
    marginRight: 12,
    color: "#666",
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: "#E8F0FE",
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
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  beneficiaryMainContent: {
    flexDirection: "row",
    alignItems: "center",
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
  avatarText: {
    color: "#A78BFA",
    fontSize: 20,
    fontWeight: "700",
  },
  beneficiaryInfo: {
    marginLeft: 16,
    flex: 1,
  },
  beneficiaryName: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  chevronIcon: {
    color: "#A78BFA",
    opacity: 0.8,
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 24,
    backgroundColor: "rgba(255, 79, 142, 0.8)",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4F8E",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "rgba(255, 79, 142, 0.4)",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyMessage: {
    color: "#E8F0FE",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubMessage: {
    color: "#A78BFA",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
  },
});

export default FamilyTies;
