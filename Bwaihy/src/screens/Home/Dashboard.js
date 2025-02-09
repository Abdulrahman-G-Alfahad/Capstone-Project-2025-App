import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Button,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { getProfile } from "../../api/auth";
import { getToken } from "../../api/storage";
import { jwtDecode } from "jwt-decode";
import UserContext from "../../context/UserContext";
import businesses from "../../data/businessesData";
import moment from "moment";
import { getFamily } from "../../api/family";
import AddMoneyButton from "../../components/AddMoneyButton";
import SendMoneyButton from "../../components/SendMoneyButton";
import AddFamilyTies from "../../components/AddFamilyTies";

const BusinessIcon = ({ businessName }) => {
  const business = businesses.find(
    (b) => b.name === businessName || b.id === 4
  ) || {
    icon: "help-circle",
    colors: { background: "#9E9E9E", icon: "#fff" },
    iconSet: MaterialCommunityIcons,
  };

  const IconComponent = {
    MaterialCommunityIcons,
    FontAwesome,
    Ionicons,
  }[business.iconSet];

  return (
    <View
      style={[
        styles.transactionIcon,
        { backgroundColor: business.colors.background },
      ]}
    >
      <IconComponent
        name={business.icon}
        size={20}
        color={business.colors.icon}
      />
    </View>
  );
};

const Dashboard = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [faceId, setFaceId] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfileAndFamily = async () => {
        try {
          const token = await getToken();
          if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            const profileData = await getProfile(userId);
            setProfile(profileData.user);

            const familyData = await getFamily(userId);
            setFamilyMembers(familyData.familyMembers);
          } else {
            throw new Error("No token found");
          }
        } catch (err) {
          setIsError(true);
          setError(err);
        } finally {
          setIsLoading(false);
        }
      };

      if (user) {
        fetchProfileAndFamily();
      }
    }, [user])
  );

  const handleFamilyMemberAdded = (updatedFamilyMembers) => {
    setFamilyMembers(updatedFamilyMembers);
  };

  const renderFamilyMember = (member, index) => {
    return (
      <TouchableOpacity
        key={member.id}
        style={styles.familyMember}
        onPress={() =>
          navigation.navigate("FamilyTieDetails", { member, profile })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {member.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </Text>
        </View>
        <Text style={styles.familyMemberName}>
          {member.fullName.split(" ")[0]}
        </Text>
      </TouchableOpacity>
    );
  };

  const groupTransactionsByDate = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const date = moment(transaction.dateTime).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {});
  };

  const renderTransactionSection = (date, transactions) => {
    return (
      <View key={date + Math.random()}>
        {transactions.map((transaction) => (
          <View
            key={transaction.id}
            style={[styles.transactionItem, styles.transactionBorder]}
          >
            <View style={styles.transactionLeft}>
              <BusinessIcon
                businessName={
                  transaction.receiver.name || transaction.receiver.fullName
                }
              />
              <View style={styles.transactionInfo}>
                <Text style={styles.businessName}>
                  {transaction.receiver.name || transaction.receiver.fullName}
                </Text>
                <Text style={styles.businessType}>
                  {transaction.receiver.address}
                </Text>
                <Text style={styles.transactionTime}>
                  {moment(transaction.dateTime).format("h:mm A")}
                </Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text style={styles.transactionAmount}>
                KD {transaction.amount}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error loading profile: {error.message}
        </Text>
      </View>
    );
  }

  const groupedTransactions = groupTransactionsByDate(
    profile.transactionHistory
  );
  const limitedTransactions = Object.entries(groupedTransactions)
    .flatMap(([date, transactions]) => transactions.map((tx) => ({ date, tx })))
    .reverse() // Reverse the transactions to show the latest ones on top
    .slice(0, 3); // Limit to the latest 3 transactions

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* The header contain the logo and the User Greeting */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>LOGO</Text>
            </View>
          </View>
          <View style={styles.greetingRow}>
            <Text style={styles.greeting}>
              Welcome, {profile ? profile.fullName : "User"} !
            </Text>

            {/* Profile Icon Navigation */}
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="person-circle-outline" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard Main Content */}
        <View style={styles.mainContent}>
          {/* The Available Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              {profile ? profile.walletBalance.toLocaleString() : "0"} KD
            </Text>

            {/* Add / Send Buttons Componants */}
            <View style={styles.balanceActions}>
              <AddMoneyButton onSuccess={setProfile} />
              <SendMoneyButton />
            </View>
          </View>

          {/* The Family Ties Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family Ties</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.familyTiesScrollView}
            >
              <View style={styles.familyTiesContainer}>
                <TouchableOpacity
                  style={styles.addFamilyButton}
                  onPress={() => setModalVisible(true)}
                >
                  <View style={[styles.avatar, styles.addAvatar]}>
                    <Ionicons name="add" size={24} color="#fff" />
                  </View>
                  <Text style={styles.addFamilyTiesButtonText}>Add</Text>
                </TouchableOpacity>
                {familyMembers.length > 0 ? (
                  familyMembers.map((member, index) =>
                    renderFamilyMember(member, index)
                  )
                ) : (
                  <View style={styles.emptyMessageWrapper}>
                    <Text style={styles.emptyMessage}>
                      No family members found.
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          {/* Add Family Ties Modal */}
          <AddFamilyTies
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            onFamilyMemberAdded={handleFamilyMemberAdded}
          />

          {/* The Transactions Section */}
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Transactions")}
            >
              <Text style={styles.sectionTitle}>Transactions</Text>
            </TouchableOpacity>
            <View style={styles.transactionsContainer}>
              {profile && profile.transactionHistory.length > 0 ? (
                limitedTransactions.map(({ date, tx }) =>
                  renderTransactionSection(date, [tx])
                )
              ) : (
                <Text style={styles.emptyMessage}>
                  You have no transactions.
                </Text>
              )}
            </View>
          </View>
        </View>
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
    backgroundColor: "#1f1d35",
  },
  header: {
    padding: 16,
    paddingTop: 2,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#2a2844",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: -4,
    marginLeft: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileIcon: {
    padding: 4,
  },
  balanceCard: {
    backgroundColor: "#2a2844",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#9991b1",
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
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
  addFamilyButton: {
    alignItems: "center",
    fontWeight: "700",
  },
  sendButton: {
    backgroundColor: "#5066C0",
    fontWeight: "700",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    // marginLeft: 3,
  },
  familyTiesScrollView: {
    maxHeight: 100,
  },
  familyTiesContainer: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  familyMember: {
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#5066C0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  addAvatar: {
    backgroundColor: "#2a2844",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  familyMemberName: {
    color: "#fff",
    fontSize: 12,
  },
  transactionsContainer: {
    backgroundColor: "#2a2844",
    borderRadius: 20,
    padding: 12,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  transactionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#1f1d35",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  businessName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  businessType: {
    color: "#9991b1",
    fontSize: 12,
  },
  transactionTime: {
    color: "#9991b1",
    fontSize: 12,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  promotionCard: {
    backgroundColor: "#FF8A65",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  promotionContent: {
    alignItems: "center",
  },
  promotionLogo: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  promotionText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  promotionSubtext: {
    color: "#fff",
    fontSize: 12,
  },
  seeMoreButton: {
    alignItems: "center",
    marginLeft: 8,
  },
  seeMoreAvatar: {
    backgroundColor: "#2a2844",
  },
  emptyMessageWrapper: {
    height: 80,
    justifyContent: "center",
    marginLeft: 16,
  },
  emptyMessage: {
    color: "#9991b1",
    fontSize: 16,
    textAlign: "left",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "#ff4f6d",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
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
  addFamilyTiesButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Dashboard;
