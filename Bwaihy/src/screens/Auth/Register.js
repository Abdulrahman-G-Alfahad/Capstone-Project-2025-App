import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { register } from "../../api/auth";
import { useMutation } from "@tanstack/react-query";
import UserContext from "../../context/UserContext";
import FaceID from "../../components/FaceID";

const Register = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [civilId, setCivilId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [isFaceIDModalVisible, setIsFaceIDModalVisible] = useState(false);

  const userInfo = {
    fullName: fullName,
    email: email,
    password: password,
    phoneNumber: phoneNumber,
    civilId: civilId,
    bankAccount: bankAccount,
    address: address,
    username: username,
  };

  const { mutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: () => register(userInfo),
    onSuccess: (data) => {
      navigation.navigate("Login");
      console.log("Registration successful:", data);
    },
    onError: () => {
      Alert.alert(
        "Registration Failed",
        "Please check your credentials and try again"
      );
    },
  });

  const handleRegister = () => {
    mutate();
  };

  const handleFaceIDSuccess = () => {
    Alert.alert("Success", "Face enrollment completed successfully!", [
      {
        text: "Continue",
        onPress: handleRegister,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Register</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subText}>Sign up to get started</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#8e8ba7"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="at-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.input}
                  placeholder="User Name"
                  placeholderTextColor="#8e8ba7"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#8e8ba7"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="#8e8ba7"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#8e8ba7"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#8e8ba7"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#8e8ba7"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.input}
                  placeholder="Civil ID"
                  placeholderTextColor="#8e8ba7"
                  value={civilId}
                  onChangeText={setCivilId}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="wallet-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.input}
                  placeholder="Bank Account Number"
                  placeholderTextColor="#8e8ba7"
                  value={bankAccount}
                  onChangeText={setBankAccount}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={24} color="#8e8ba7" />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="#8e8ba7"
                  value={address}
                  onChangeText={setAddress}
                  autoCapitalize="words"
                />
              </View>

              <TouchableOpacity
                style={styles.faceIdButton}
                onPress={() => {
                  console.log("Set up Face ID button clicked");
                  setIsFaceIDModalVisible(true);
                }}
              >
                <Ionicons name="scan-outline" size={24} color="#fff" />
                <Text style={styles.faceIdButtonText}>Set up Face ID</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginHighlight}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FaceID
        isVisible={isFaceIDModalVisible}
        onClose={() => setIsFaceIDModalVisible(false)}
        onSuccess={handleFaceIDSuccess}
        userData={{ email, username, fullName }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1d35",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#1f1d35",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2844",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 35,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    marginTop: -60,
  },
  welcomeText: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#8e8ba7",
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    width: "100%",
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2844",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 12,
    fontSize: 16,
    height: 24,
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: "#FF4F6D",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#FF4F6D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginText: {
    color: "#8e8ba7",
    fontSize: 14,
  },
  loginHighlight: {
    color: "#FF4F6D",
    fontWeight: "600",
  },
  faceIdButton: {
    backgroundColor: "#4B4CED",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  faceIdButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default Register;
