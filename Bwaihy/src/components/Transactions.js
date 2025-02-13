import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import { format } from "date-fns";
import businesses from "../data/businessesData";
import UserContext from "../context/UserContext";
import moment from "moment";
import { getToken } from "../api/storage";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "../api/auth";

const TransactionIcon = ({ businessName }) => {
  const business = businesses.find(
    (b) => b.name === businessName || b.id == 4
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

const groupTransactionsByDate = (transactions) => {
  const grouped = {};
  transactions.forEach((transaction) => {
    const formattedDate = moment(transaction.dateTime).format("YYYY-MM-DD");
    if (!grouped[formattedDate]) {
      grouped[formattedDate] = [];
    }
    grouped[formattedDate].push(transaction);
  });
  return Object.entries(grouped).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );
};

const Transactions = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isStartDate, setIsStartDate] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Getting token...");
        const token = await getToken();
        // console.log(token)
        if (token) {
          const decodedToken = jwtDecode(token);
          // console.log(decodedToken);
          const userId = decodedToken.userId;
          // console.log(userId)
          const profileData = await getProfile(userId);
          // console.log(profileData.user);
          setProfile(profileData.user);
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
      fetchProfile();
    }
  }, [user]);

  const handleDateSelect = (date) => {
    if (date) {
      const selectedDate = new Date(date);
      if (isStartDate) {
        setStartDate(selectedDate);
        if (selectedDate > endDate) {
          setEndDate(selectedDate);
        }
      } else {
        setEndDate(selectedDate);
        if (selectedDate < startDate) {
          setStartDate(selectedDate);
        }
      }
    }
    setShowCalendarModal(false);
  };

  const openCalendar = (forStartDate) => {
    setIsStartDate(forStartDate);
    setShowCalendarModal(true);
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
      .filter((transaction) => {
        // Apply date range filter
        const transactionDate = moment(transaction.dateTime).startOf("day");
        const startDateMoment = moment(startDate).startOf("day");
        const endDateMoment = moment(endDate).startOf("day");
        const isWithinDateRange = transactionDate.isBetween(
          startDateMoment,
          endDateMoment,
          "day",
          "[]"
        );

        // Apply search filter
        const searchLower = searchQuery.toLowerCase();
        const receiverName = (
          transaction.receiver.name ||
          transaction.receiver.fullName ||
          ""
        ).toLowerCase();
        const amount = transaction.amount.toString();
        const method = transaction.method.toLowerCase();
        const matchesSearch =
          !searchQuery ||
          receiverName.includes(searchLower) ||
          amount.includes(searchLower) ||
          method.includes(searchLower);

        return isWithinDateRange && matchesSearch;
      })
      .reverse()
  );
  console.log(groupedTransactions);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.filterContainer}>
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
              placeholder="Search transactions ..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Date Range Filter */}
          <View style={styles.dateRangeContainer}>
            <View style={styles.dateRangeWrapper}>
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>From</Text>
                <TouchableOpacity
                  style={styles.dateButtonShadcn}
                  onPress={() => openCalendar(true)}
                >
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#A78BFA"
                  />
                  <Text style={styles.dateTextShadcn} numberOfLines={1}>
                    {format(startDate, "MMM dd, yyyy")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dateRangeDivider}>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>To</Text>
                <TouchableOpacity
                  style={styles.dateButtonShadcn}
                  onPress={() => openCalendar(false)}
                >
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#A78BFA"
                  />
                  <Text style={styles.dateTextShadcn} numberOfLines={1}>
                    {format(endDate, "MMM dd, yyyy")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Transaction List */}
        <ScrollView style={styles.transactionList}>
          {groupedTransactions.map(([date, transactions]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>
                {moment(date).isSame(moment(), "day")
                  ? "Today"
                  : moment(date).format("MMMM D, YYYY")}
              </Text>
              {transactions.map((transaction) => (
                <View
                  key={transaction.id}
                  style={[styles.transactionItem, styles.transactionBorder]}
                >
                  <View style={styles.transactionLeft}>
                    <TransactionIcon
                      businessName={
                        transaction.receiver.name ||
                        transaction.receiver.fullName
                      }
                    />
                    <View style={styles.transactionInfo}>
                      {transaction.method === "DEPOSIT" ? (
                        <>
                          <Text style={styles.businessName}>Deposit</Text>
                          <Text style={styles.transactionTime}>
                            {moment(transaction.dateTime).format("YYYY-MM-DD")}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.businessName}>
                            {transaction.receiver.name ||
                              transaction.receiver.fullName}
                          </Text>
                          <Text style={styles.businessType}>
                            {transaction.receiver.address}
                          </Text>
                          <Text style={styles.transactionTime}>
                            {moment(transaction.dateTime).format("h:mm A")}
                          </Text>
                        </>
                      )}
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
          ))}
        </ScrollView>

        {/* Calendar Modal */}
        <Modal
          visible={showCalendarModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCalendarModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowCalendarModal(false)}
          >
            <View style={styles.calendarContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCalendarModal(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <CalendarPicker
                style={{ flex: 1 }}
                startFromMonday={true}
                minDate={isStartDate ? undefined : startDate}
                maxDate={isStartDate ? endDate : undefined}
                selectedStartDate={isStartDate ? startDate : endDate}
                onDateChange={handleDateSelect}
                textStyle={styles.calendarText}
                selectedDayColor="#4f46e5"
                selectedDayTextColor="#ffffff"
                todayBackgroundColor="transparent"
                todayTextStyle={{ color: "#4f46e5" }}
                monthTitleStyle={styles.calendarHeaderText}
                yearTitleStyle={styles.calendarHeaderText}
                previousComponent={
                  <Ionicons name="chevron-back" size={24} color="#fff" />
                }
                nextComponent={
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                }
                weekdays={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                dayLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                monthYearHeaderWrapperStyle={styles.monthYearHeaderWrapper}
                dayLabelsWrapper={{
                  backgroundColor: "transparent",
                  borderTopWidth: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: "#3f3d56",
                  paddingBottom: 10,
                  marginBottom: 10,
                }}
                customDatesStyles={[
                  {
                    date: startDate,
                    style: { backgroundColor: "#4f46e5" },
                    textStyle: { color: "#ffffff" },
                  },
                  {
                    date: endDate,
                    style: { backgroundColor: "#4f46e5" },
                    textStyle: { color: "#ffffff" },
                  },
                ]}
                width={Dimensions.get("window").width * 0.8}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.1)",
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  searchIcon: {
    marginRight: 8,
    color: "#666",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#E8F0FE",
    fontSize: 16,
  },
  dateRangeContainer: {
    marginBottom: 16,
  },
  dateRangeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  dateSection: {
    flex: 1,
  },
  dateLabel: {
    color: "#A78BFA",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  dateButtonShadcn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141E30",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  dateTextShadcn: {
    color: "#E8F0FE",
    fontSize: 14,
    flex: 1,
  },
  dateRangeDivider: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dividerLine: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(167, 139, 250, 0.2)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 30, 48, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: "#1A2942",
    borderRadius: 24,
    padding: 20,
    width: Dimensions.get("window").width * 0.9,
    maxHeight: Dimensions.get("window").height * 0.8,
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
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 8,
  },
  calendarText: {
    color: "#E8F0FE",
    fontSize: 14,
    fontWeight: "400",
  },
  calendarHeaderText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  monthYearHeaderWrapper: {
    paddingVertical: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionList: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E8F0FE",
    marginBottom: 12,
    paddingHorizontal: 4,
    letterSpacing: 0.5,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
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
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
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
  loadingText: {
    color: "#E8F0FE",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Transactions;
