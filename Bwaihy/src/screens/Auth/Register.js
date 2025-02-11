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
import AccountContext from "../../context/AccountContext";
import FaceID from "../../components/FaceID";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [civilId, setCivilId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const { setUser } = useContext(UserContext);
  const { setAccountType, setUserId } = useContext(AccountContext);
  const [showFaceID, setShowFaceID] = useState(false);
  const [faceId, setFaceId] = useState("");

  const userInfo = {
    fullName: fullName,
    email: email,
    password: password,
    phoneNumber: phoneNumber,
    civilId: civilId,
    bankAccount: bankAccount,
    address: address,
    username: username,
    faceId: faceId,
  };

  const { mutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: () => register(userInfo),
    onSuccess: (data) => {
      console.log(data);
      if (data.token) {
        const decodedToken = jwtDecode(data.token);
        setUser(true);
        setAccountType(decodedToken.accountType);
        setUserId(decodedToken.userId);
      }
      navigation.navigate("Login");
      console.log("Registration successful:", data);
    },
    onError: (error) => {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        "Please check your credentials and try again"
      );
    },
  });

  const handleRegister = () => {
    console.log("first");
    console.log(faceId);
    if (
      !fullName ||
      !email ||
      !password ||
      !phoneNumber ||
      !civilId ||
      !bankAccount ||
      !address ||
      !username
    ) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    console.log("Registering user with data:", userInfo);
    mutate();
  };

  const handleFaceIDSuccess = (data) => {
    setFaceId(data.facialId);
    setShowFaceID(false);
    Alert.alert("Success", "Face enrollment completed successfully!", [
      {
        text: "Continue",
        onPress: handleRegister,
      },
    ]);
  };

  const validateStep1 = () => {
    if (!fullName || !email || !username || !password) {
      Alert.alert(
        "Validation Error",
        "Please fill in all user information fields"
      );
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!phoneNumber || !civilId || !bankAccount || !address) {
      Alert.alert(
        "Validation Error",
        "Please fill in all personal information fields"
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: "User Info", icon: "person-outline" },
      { number: 2, label: "Personal Info", icon: "card-outline" },
      { number: 3, label: "Face ID", icon: "scan-outline" },
    ];

    return (
      <View style={styles.stepperContainer}>
        <View style={styles.stepRow}>
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <View style={styles.stepWrapper}>
                <View
                  style={[
                    styles.step,
                    currentStep >= step.number && styles.activeStep,
                  ]}
                >
                  <Ionicons
                    name={step.icon}
                    size={20}
                    color={currentStep >= step.number ? "#fff" : "#8e8ba7"}
                  />
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    currentStep >= step.number && styles.activeStepLabel,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    currentStep > step.number && styles.activeStepLine,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  };

  const renderStep1 = () => (
    <>
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
          placeholder="Email"
          placeholderTextColor="#8e8ba7"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="person-circle-outline" size={24} color="#8e8ba7" />
        <TextInput
          style={styles.input}
          placeholder="Username"
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
    </>
  );

  const renderStep2 = () => (
    <>
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
    </>
  );

  const renderStep3 = () => (
    <View style={styles.faceIdStep}>
      <TouchableOpacity
        style={styles.faceIdButton}
        onPress={() => setShowFaceID(true)}
      >
        <Ionicons name="scan-outline" size={24} color="#fff" />
        <Text style={styles.faceIdButtonText}>
          {faceId ? "Face ID Set ✓" : "Set up Face ID"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Register</Text>
      </View>

      {renderStepIndicator()}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.form}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <View style={styles.navigationButtons}>
                {currentStep > 1 && (
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                  >
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                )}

                {currentStep < 3 ? (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                  >
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleRegister}
                  >
                    <Text style={styles.buttonText}>Register</Text>
                  </TouchableOpacity>
                )}
              </View>

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
        isVisible={showFaceID}
        onClose={() => setShowFaceID(false)}
        onSuccess={handleFaceIDSuccess}
        userData={{ email, username, fullName }}
        mode="enroll"
        setFaceId={setFaceId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.2)",
    alignItems: "center",
    shadowColor: "#A78BFA",
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
    fontWeight: "800",
    color: "#E8F0FE",
    letterSpacing: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(142, 139, 167, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#E8F0FE",
    paddingVertical: 16,
    marginLeft: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  buttonText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  loginText: {
    color: "#A78BFA",
    fontSize: 15,
    fontWeight: "500",
  },
  loginHighlight: {
    color: "#E8F0FE",
    fontWeight: "700",
  },
  faceIdButton: {
    backgroundColor: "rgba(232, 240, 254, 0.15)",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8F0FE",
  },
  faceIdButtonText: {
    color: "#E8F0FE",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  stepperContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#141E30",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepWrapper: {
    alignItems: "center",
    width: 80,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(142, 139, 167, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8e8ba7",
  },
  activeStep: {
    backgroundColor: "#A78BFA",
    borderColor: "#A78BFA",
  },
  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: "rgba(142, 139, 167, 0.1)",
    marginHorizontal: 4,
  },
  activeStepLine: {
    backgroundColor: "#A78BFA",
  },
  stepLabel: {
    color: "#8e8ba7",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  activeStepLabel: {
    color: "#A78BFA",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 90,
  },
  backButton: {
    backgroundColor: "rgba(142, 139, 167, 0.1)",
    padding: 18,
    borderRadius: 16,
    flex: 1,
    marginRight: 8,
  },
  backButtonText: {
    color: "#8e8ba7",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#A78BFA",
    padding: 18,
    borderRadius: 16,
    flex: 1,
    marginLeft: 8,
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  faceIdStep: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
});

export default Register;
