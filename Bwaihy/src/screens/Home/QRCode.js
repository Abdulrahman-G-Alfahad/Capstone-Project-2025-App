import React, { useState, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Share,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import AccountContext from "../../context/AccountContext";

const QRCodeScreen = () => {
  const navigation = useNavigation();
  const { userId } = useContext(AccountContext);
  const [amount, setAmount] = useState("");
  const [qrValue, setQRValue] = useState("");
  const qrRef = useRef();

  const generateQRCode = () => {
    Keyboard.dismiss();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!userId) {
      alert("User ID not found. Please try logging in again.");
      return;
    }
    // Generate QR code value with both amount and user ID
    const value = JSON.stringify({
      type: "PAYMENT",
      amount: parseFloat(amount),
      userId: userId,
      timestamp: Date.now(),
    });
    setQRValue(value);
  };

  const handleShare = async () => {
    if (!qrRef.current) return;

    try {
      // Get base64 string representation of QR code
      qrRef.current.toDataURL(async (base64) => {
        try {
          // For iOS, we need the full data URI
          const shareOptions = Platform.select({
            ios: {
              url: `data:image/png;base64,${base64}`,
              type: "image/png",
            },
            android: {
              url: FileSystem.documentDirectory + "qr-code.png",
            },
          });

          if (Platform.OS === "android") {
            // For Android, we need to save the file first
            await FileSystem.writeAsStringAsync(shareOptions.url, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          }

          // Share the file
          await Share.share({
            ...shareOptions,
            title: "Payment QR Code",
            message: `Payment QR Code for amount: ${amount}`,
          });
        } catch (error) {
          console.error("Error in sharing:", error);
          alert("Error sharing QR code");
        }
      });
    } catch (error) {
      console.error("Error generating QR:", error);
      alert("Error generating QR code");
    }
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(qrValue);
      alert("QR code value copied to clipboard!");
    } catch (error) {
      alert("Error copying to clipboard");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back-outline" size={28} color="#fff" />
              </TouchableOpacity>
              {/* <Text style={styles.headerTitle}>QR Code</Text> */}
            </View>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.contentContainer}>
              <View style={styles.card}>
                <Text style={styles.title}>Generate Payment QR Code</Text>
                <Text style={styles.subtitle}>
                  Enter the amount to generate a QR code for payment
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Amount</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="cash-outline" size={24} color="#8e8ba7" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter amount"
                      placeholderTextColor="#8e8ba7"
                      keyboardType="numeric"
                      value={amount}
                      onChangeText={setAmount}
                    />
                  </View>

                  {/* Generate QR Code Button */}
                  <TouchableOpacity
                    style={styles.generateButton}
                    onPress={generateQRCode}
                  >
                    <Ionicons
                      name="qr-code-outline"
                      size={24}
                      color="#E8F0FE"
                    />
                    <Text style={styles.buttonText}>Generate QR Code</Text>
                  </TouchableOpacity>
                </View>

                {qrValue ? (
                  <View style={styles.qrContainer}>
                    <View style={styles.qrWrapper}>
                      <QRCode
                        value={qrValue}
                        size={200}
                        color="#000000"
                        backgroundColor="#ffffff"
                        getRef={(ref) => (qrRef.current = ref)}
                      />
                      <View style={styles.amountDisplay}>
                        <Text style={styles.amountText}>{amount} KD</Text>
                      </View>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleShare}
                      >
                        <Ionicons
                          name="share-outline"
                          size={24}
                          color="#E8F0FE"
                        />
                        <Text style={styles.buttonText}>Share Code</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: "#141E30",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    paddingBottom: 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 8,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E8F0FE",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#8e8ba7",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E8F0FE",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: "#E8F0FE",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  generateButton: {
    backgroundColor: "#A78BFA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  qrWrapper: {
    padding: 24,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 24,
    alignItems: "center",
  },
  amountDisplay: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    width: "100%",
    alignItems: "center",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.5,
  },
  actionButtons: {
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#0D9488",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#E8F0FE",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif",
  },
});

export default QRCodeScreen;
