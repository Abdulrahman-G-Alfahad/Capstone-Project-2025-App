import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // // Implement registration logic
    // console.log("Register attempt with:", {
    //   fullName,
    //   email,
    //   password,
    //   phoneNumber,
    // });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Register</Text>
      </View>

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

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginHighlight}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#8e8ba7",
    fontSize: 14,
  },
  loginHighlight: {
    color: "#FF4F6D",
    fontWeight: "600",
  },
});

export default Register;
