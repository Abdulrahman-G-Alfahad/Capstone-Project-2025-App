import React, { use, useContext, useEffect, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
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
import { addFamily, getFamily } from "../../api/family";
import { makeDeposit } from "../../api/transactions";

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
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
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
  }, [user]);

  const handleAddFamilyMember = async () => {
    try {
      const token = await getToken();
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const familyInfo = { fullName, walletBalance, faceId };
      await addFamily(userId, familyInfo);
      const familyData = await getFamily(userId);
      setFamilyMembers(familyData.familyMembers);
      setModalVisible(false);
      setFullName("");
      setWalletBalance("");
      setFaceId("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMakeDeposit = async () => {
    console.log("first");
    try {
      const token = await getToken();
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      console.log(userId, depositAmount);
      await makeDeposit(userId, { amount: depositAmount });
      const profileData = await getProfile(userId);
      setProfile(profileData.user);
      setDepositModalVisible(false);
      setDepositAmount("");
    } catch (error) {
      console.error(error);
    }
  };

  const renderFamilyMember = (member, index) => {
    return (
      <TouchableOpacity key={member.id} style={styles.familyMember}>
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
    .slice(-3);

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
          <Text style={styles.greeting}>
            Hello, {profile ? profile.fullName : "User"}!
          </Text>
        </View>

        <View style={styles.mainContent}>
          {/* The Available Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              {profile ? profile.walletBalance.toLocaleString() : "0"} KD
            </Text>
            <View style={styles.balanceActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.addButton]}
                onPress={() => setDepositModalVisible(true)}
              >
                <Ionicons name="add" size={24} color="#fff" weight="bold" />
                <Text style={styles.actionButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.sendButton]}
              >
                <Ionicons
                  name="paper-plane"
                  size={24}
                  color="#fff"
                  weight="bold"
                />
                <Text style={styles.actionButtonText}>Send</Text>
              </TouchableOpacity>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={depositModalVisible}
              onRequestClose={() => {
                setDepositModalVisible(!depositModalVisible);
              }}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Add to Balance</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    value={depositAmount}
                    onChangeText={setDepositAmount}
                    keyboardType="numeric"
                  />
                  <Button title="Submit" onPress={handleMakeDeposit} />
                  <Button
                    title="Cancel"
                    onPress={() => setDepositModalVisible(false)}
                    color="red"
                  />
                </View>
              </View>
            </Modal>
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
                </TouchableOpacity>
                {familyMembers.length > 0 ? (
                  familyMembers.map((member, index) =>
                    renderFamilyMember(member, index)
                  )
                ) : (
                  <Text style={styles.emptyMessage}>
                    No family members found.
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>

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

          {/* The Promotion Card / Needs editing , make it carousel add more promotions */}
          {/* <View style={styles.promotionCard}>
            <View style={styles.promotionContent}>
              <Image
                source={{
                  uri: "https://www.trolley.com.kw/storage/store_location/default.png",
                }}
                style={styles.promotionLogo}
              />
              <Text style={styles.promotionText}>20 % OFF</Text>
              <Text style={styles.promotionSubtext}>
                Exclusive deals just for you!
              </Text>
            </View>
          </View> */}
        </View>
      </View>

      {/* Add Family Member Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Family Member</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Wallet Balance"
              value={walletBalance}
              onChangeText={setWalletBalance}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Face ID"
              value={faceId}
              onChangeText={setFaceId}
            />
            <Button title="Submit" onPress={handleAddFamilyMember} />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
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
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: -4,
    marginLeft: 8,
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
    //backgroundColor: "#FF4F6D",
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
  emptyMessage: {
    color: "#9991b1",
    fontSize: 16,
    marginLeft: 8,
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default Dashboard;
