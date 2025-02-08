import React, { useState, useContext } from "react";
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
import UserContext from "../../context/UserContext";
import { login } from "../../api/auth";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { jwtDecode } from "jwt-decode";
import AccountContext from "../../context/AccountContext";

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);
  const { setAccountType } = useContext(AccountContext);

  const userInfo = {
    username: username,
    password: password,
  };

  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => login(userInfo),
    onSuccess: (data) => {
      console.log(data);
      console.log(data.token);
      setUser(true);
      const decodedToken = jwtDecode(data.token);
      console.log(decodedToken);
      setAccountType(decodedToken.accountType);
      // console.log("Login successful:", data);
      // console.log("Decoded account type:", decodedToken.accountType);
    },
    onError: () => {
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again"
      );
    },
  });

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log("Login attempt with:", username, password);
    mutate();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Login</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.subText}>Sign in to Continue</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="#8e8ba7" />
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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerHighlight}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  header: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 20,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.2)",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#E8F0FE",
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
    fontWeight: "800",
    color: "#E8F0FE",
    marginBottom: 8,
    marginTop: -80,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 16,
    color: "#A78BFA",
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  input: {
    flex: 1,
    color: "#E8F0FE",
    marginLeft: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: "#FF4F8E",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#FF4F8E",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#A78BFA",
    fontSize: 15,
    fontWeight: "500",
  },
  registerHighlight: {
    color: "#E8F0FE",
    fontWeight: "700",
  },
});

export default Login;
