import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import { format } from "date-fns";
import businesses from "../data/businessesData";

const transactionData = [
  {
    id: "1",
    date: "2025-01-20",
    business: businesses[0],
    amount: -15.0,
  },
  {
    id: "2",
    date: "2025-01-20",
    business: businesses[1],
    amount: -10.75,
  },
  {
    id: "3",
    date: "2024-12-19",
    business: businesses[2],
    amount: -45.5,
  },
  {
    id: "4",
    date: "2025-02-01",
    business: businesses[3],
    amount: -8.75,
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
        styles.iconContainer,
        { backgroundColor: business.colors.background },
      ]}
    >
      <IconComponent
        name={business.icon}
        size={24}
        color={business.colors.icon}
      />
    </View>
  );
};

const groupTransactionsByDate = (transactions) => {
  const grouped = {};
  transactions.forEach((transaction) => {
    if (!grouped[transaction.date]) {
      grouped[transaction.date] = [];
    }
    grouped[transaction.date].push(transaction);
  });
  return Object.entries(grouped).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );
};

const Transactions = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isStartDate, setIsStartDate] = useState(true);

  const handleDateSelect = (date) => {
    if (date) {
      const selectedDate = new Date(date);
      if (isStartDate) {
        setStartDate(selectedDate);
        // If selected start date is after current end date, update end date
        if (selectedDate > endDate) {
          setEndDate(selectedDate);
        }
      } else {
        setEndDate(selectedDate);
        // If selected end date is before current start date, update start date
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
          {/* Should it be a single date filter? */}
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
                    color="#fff"
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
                    color="#fff"
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
          {groupTransactionsByDate(transactionData).map(
            ([date, transactions]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>
                  {format(new Date(date), "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd")
                    ? "Today"
                    : format(new Date(date), "EEEE, MMMM d")}
                </Text>
                {transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionCard}>
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
                      <Text style={styles.amount}>
                        {Math.abs(transaction.amount).toFixed(2)} KD
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )
          )}
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
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
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
    backgroundColor: "#2a2844",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingVertical: 0,
  },
  dateRangeContainer: {
    marginBottom: 16,
  },
  dateRangeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2844",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  dateSection: {
    flex: 1,
  },
  dateLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  dateButtonShadcn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1d35",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  dateTextShadcn: {
    color: "#fff",
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
    backgroundColor: "#3f3d56",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: "#2a2844",
    borderRadius: 16,
    padding: 20,
    width: Dimensions.get("window").width * 0.9,
    maxHeight: Dimensions.get("window").height * 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 8,
  },
  calendarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
  },
  calendarHeaderText: {
    color: "#fff",
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
  dayLabelsWrapper: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#3f3d56",
  },
  transactionList: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2844",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  businessType: {
    fontSize: 14,
    color: "#9ca3af",
  },
  transactionRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default Transactions;
