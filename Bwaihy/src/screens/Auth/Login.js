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
  const {setUser} = useContext(UserContext);
  const {setAccountType } = useContext(AccountContext);


  const userInfo = {
    username: username,
    password: password,
  };

  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => login(userInfo),
    onSuccess: (data) => {
      setUser(true);
      const decodedToken = jwtDecode(data.token);
      setAccountType(decodedToken.accountType);
      // console.log("Login successful:", data);
      // console.log("Decoded account type:", decodedToken.accountType);
    },
    onError: () => {
      Alert.alert("Login Failed", "Please check your credentials and try again");
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
    marginTop: -80,
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
    marginTop: 10,
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
  loginButton: {
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#8e8ba7",
    fontSize: 14,
  },
  registerHighlight: {
    color: "#FF4F6D",
    fontWeight: "600",
  },
});

export default Login;
