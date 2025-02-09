import React, { useContext, useEffect, useState } from "react";
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
  Platform,
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
  const [isAddMoneyModalVisible, setIsAddMoneyModalVisible] = useState(false);
  const [isSendMoneyModalVisible, setIsSendMoneyModalVisible] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

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

  const formatBalance = (balance) => {
    if (!profile) return "0";
    if (isBalanceHidden) return "••••••";
    return balance.toLocaleString();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
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
          <View style={styles.greetingRow}>
            <Text style={styles.logoText}>
              <Text style={styles.logoBold}>F</Text>
              ace<Text style={styles.logoBold}>B</Text>ouk
            </Text>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="person" size={20} color="#A78BFA" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard Main Content */}
        <ScrollView
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting Section */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingTime}>{getGreeting()}</Text>
            <Text style={styles.greeting}>
              {profile ? profile.fullName.split(" ")[0] : "User"} 👋
            </Text>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceAmount}>
                    {formatBalance(profile?.walletBalance)} KD
                  </Text>
                  <TouchableOpacity
                    style={styles.visibilityButton}
                    onPress={() => setIsBalanceHidden(!isBalanceHidden)}
                  >
                    <Ionicons
                      name={isBalanceHidden ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="#9991b1"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.balanceActions}>
              <AddMoneyButton
                onSuccess={(updatedProfile) => setProfile(updatedProfile)}
              />
              <SendMoneyButton />
            </View>
          </View>

          {/* Family Ties Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Family Ties</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("FamilyTies")}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
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
                  <Text style={styles.addFamilyTiesButtonText}>Add New</Text>
                </TouchableOpacity>
                {familyMembers.length > 0 ? (
                  familyMembers.map((member, index) =>
                    renderFamilyMember(member, index)
                  )
                ) : (
                  <View style={styles.emptyMessageWrapper}>
                    <Text style={styles.emptyMessage}>
                      Add your family members to get started
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          {/* Transactions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Transactions")}
              >
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.transactionsContainer}>
              {profile && profile.transactionHistory.length > 0 ? (
                limitedTransactions.map(({ date, tx }) =>
                  renderTransactionSection(date, [tx])
                )
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="receipt-outline" size={48} color="#9991b1" />
                  <Text style={styles.emptyMessage}>No transactions yet</Text>
                  <Text style={styles.emptySubMessage}>
                    Your transactions will appear here
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("QRCode")}
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#6C63FF" }]}
              >
                <Ionicons name="qr-code-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Scan QR</Text>
              <Text style={styles.quickActionSubText}>Pay with QR code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("Promotions")}
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#FF6B6B" }]}
              >
                <Ionicons name="gift-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Promotions</Text>
              <Text style={styles.quickActionSubText}>View offers</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Add Family Ties Modal */}
        <AddFamilyTies
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onFamilyMemberAdded={handleFamilyMemberAdded}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#141E30",
    paddingTop: Platform.OS === "ios" ? 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  header: {
    padding: 12,
    paddingTop: 4,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logoText: {
    color: "#E8F0FE",
    fontSize: 26,
    fontWeight: "400",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  logoBold: {
    fontWeight: "700",
  },
  greetingContainer: {
    marginTop: 20,
    marginBottom: 8,
  },
  greetingTime: {
    fontSize: 16,
    color: "#A78BFA",
    marginBottom: 4,
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E8F0FE",
    letterSpacing: 0.5,
  },
  profileIcon: {
    padding: 6,
    backgroundColor: "rgba(167, 139, 250, 0.08)",
    borderRadius: 50,
    width: 36,
    height: 36,
    borderWidth: 1.5,
    borderColor: "#A78BFA",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCard: {
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 24,
    padding: 24,
    marginVertical: 16,
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
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  balanceLabel: {
    color: "#A78BFA",
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  visibilityButton: {
    padding: 8,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderRadius: 50,
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceAmount: {
    color: "#E8F0FE",
    fontSize: 40,
    fontWeight: "800",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    letterSpacing: 0.5,
    textShadowColor: "rgba(167, 139, 250, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#E8F0FE",
    letterSpacing: 0.5,
  },
  seeAllText: {
    color: "#A78BFA",
    fontSize: 15,
    fontWeight: "600",
  },
  familyTiesScrollView: {
    maxHeight: 120,
  },
  familyTiesContainer: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  familyMember: {
    alignItems: "center",
    width: 75,
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
  addAvatar: {
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "rgba(167, 139, 250, 0.4)",
  },
  avatarText: {
    color: "#A78BFA",
    fontSize: 20,
    fontWeight: "700",
  },
  familyMemberName: {
    color: "#E8F0FE",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  transactionsContainer: {
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  transactionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.1)",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    backgroundColor: "rgba(167, 139, 250, 0.1)",
  },
  transactionInfo: {
    flex: 1,
  },
  businessName: {
    color: "#E8F0FE",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  businessType: {
    color: "#A78BFA",
    fontSize: 14,
    marginBottom: 2,
    fontWeight: "500",
  },
  transactionTime: {
    color: "#A78BFA",
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.8,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },
  emptyStateContainer: {
    alignItems: "center",
    padding: 32,
  },
  emptyMessage: {
    color: "#A78BFA",
    fontSize: 17,
    marginTop: 16,
    marginBottom: 4,
    fontWeight: "600",
  },
  emptySubMessage: {
    color: "#A78BFA",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 16,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  quickActionText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  quickActionSubText: {
    color: "#A78BFA",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  balanceActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  addButton: {
    backgroundColor: "#A78BFA",
  },
  sendButton: {
    backgroundColor: "#FF6B6B",
  },
  actionButtonText: {
    color: "#E8F0FE",
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
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
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
    marginBottom: 16,
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
  },
  modalButtonText: {
    color: "#141E30",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  addFamilyTiesButtonText: {
    color: "#E8F0FE",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyMessageWrapper: {
    alignItems: "center",
    padding: 24,
  },
});

export default Dashboard;
