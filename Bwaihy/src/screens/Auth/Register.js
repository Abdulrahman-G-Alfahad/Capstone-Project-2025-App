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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { register } from "../../api/auth";
import { useMutation} from "@tanstack/react-query";
import UserContext from "../../context/UserContext";
import { Alert } from "react-native";


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
  const {user, setUser} = useContext(UserContext);

  const userInfo = {
    fullName: fullName,
    email: email,
    password: password,
    phoneNumber: phoneNumber,
    civilId: civilId,
    bankAccount: bankAccount,
    address: address,
    username: username
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Register</Text>
      </View>

      <ScrollView>
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
            <Ionicons name="person-outline" size={24} color="#8e8ba7" />
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
            <Ionicons name="lock-closed-outline" size={24} color="#8e8ba7" />
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
            <Ionicons name="person-outline" size={24} color="#8e8ba7" />
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
            <Ionicons name="person-outline" size={24} color="#8e8ba7" />
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
            <Ionicons name="person-outline" size={24} color="#8e8ba7" />
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
              /* Face ID setup logic */
            }}
          >
            <Ionicons name="scan-outline" size={24} color="#fff" />
            {/* <Icon name="face-retouching-natural" size={24} color="#000" /> */}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1d35",
  },
  header: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 20,
    backgroundColor: "#1f1d35",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2844",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    marginTop: -60,
  },
  subText: {
    fontSize: 16,
    color: "#8e8ba7",
    marginBottom: 40,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2844",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: "#FF4F6D",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
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
    marginTop: 20,
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
    marginTop: 24,
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
