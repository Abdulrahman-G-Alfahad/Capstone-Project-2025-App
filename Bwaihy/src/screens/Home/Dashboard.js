import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { beneficiaryData } from "../../data/beneficiaryData";
import businesses from "../../data/businessesData";

const transactionData = [
  {
    id: "1",
    business: businesses[0],
    amount: 15,
    status: "Success",
  },
  {
    id: "2",
    business: businesses[1],
    amount: 10,
    status: "Success",
  },
  {
    id: "3",
    business: businesses[2],
    amount: 30,
    status: "Failed",
  },
  {
    id: "4",
    business: businesses[0],
    amount: 5,
    status: "Success",
  },
];

const TransactionIcon = ({ business }) => {
  const IconComponent = {
    MaterialCommunityIcons,
    FontAwesome,
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

  const renderFamilyMember = (member, index) => {
    if (index < 4) {
      return (
        <TouchableOpacity key={member.id} style={styles.familyMember}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
          <Text style={styles.familyMemberName}>
            {member.name.split(" ")[0]}
          </Text>
        </TouchableOpacity>
      );
    }
  };

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
          <Text style={styles.greeting}>Hello, Nora!</Text>
        </View>

        <View style={styles.mainContent}>
          {/* The Avaliable Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>5,000,000.000 KD</Text>
            <View style={styles.balanceActions}>
              <TouchableOpacity style={[styles.actionButton, styles.addButton]}>
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
                {beneficiaryData.map((member, index) =>
                  renderFamilyMember(member, index)
                )}
                <TouchableOpacity
                  style={styles.seeMoreButton}
                  onPress={() => navigation.navigate("FamilyTies")}
                >
                  <View style={[styles.avatar, styles.seeMoreAvatar]}>
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                  </View>
                  <Text style={styles.familyMemberName}>See More</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* The Transactions Section */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transactions</Text>
            <View style={styles.transactionsContainer}>
              {transactionData.map((transaction, index) => (
                <View
                  key={transaction.id}
                  style={[
                    styles.transactionItem,
                    index !== 0 && styles.transactionBorder,
                  ]}
                >
                  <View style={styles.transactionLeft}>
                    <TransactionIcon business={transaction.business} />
                    <View style={styles.transactionInfo}>
                      <Text style={styles.businessName}>
                        {transaction.business.name}
                      </Text>
                      <Text style={styles.businessType}>
                        {transaction.business.type}
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
          </View>

          {/* The Promotion Card / Needs editing , make iot carousel add more promotions*/}

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
    borderTopWidth: 1,
    borderTopColor: "#1f1d35",
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
});

export default Dashboard;
