import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { deleteToken, getToken } from "../../api/storage";
import UserContext from "../../context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/auth";
import { jwtDecode } from "jwt-decode";
import Avatar from "../../components/Avatar";

const Profile = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [civilId, setCivilId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [showPin, setShowPin] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const fetchProfile = async () => {
    const token = await getToken();
    if (token) {
      // console.log(token)
      // console.log(jwtDecode(token))
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId; // Assuming the user ID is stored in the 'id' field
      return getProfile(userId);
    }
    throw new Error("No token found");
  };

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", user],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.user.fullName);
      setPhoneNumber(profile.user.phoneNumber);
      setEmail(profile.user.email);
      setPhoto(profile.user.photo);
      setCivilId(profile.user.civilId || "");
      setBankAccount(profile.user.bankAccount || "");
      setPinCode(profile.user.pinCode || "");
    }
  }, [profile]);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the changes to a backend
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      handleSave();
    }
  };

  const handleCancel = () => {
    // Reset user data to original state
    if (profile) {
      setName(profile.fullName);
      setPhoneNumber(profile.phoneNumber);
      setEmail(profile.email);
      setPhoto(profile.photo);
      setCivilId(profile.civilId || "");
      setBankAccount(profile.bankAccount || "");
      setPinCode(profile.pinCode || "");
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    deleteToken();
    setUser(false);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to change your photo!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error picking image");
    }
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back-outline" size={28} color="#A78BFA" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>

          {/* edit and cancel buttons */}
          {isEditing ? (
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity
                style={styles.editActionButton}
                onPress={handleCancel}
              >
                <Ionicons name="close-outline" size={24} color="#FF4F6D" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editActionButton}
                onPress={handleEdit}
              >
                <Ionicons name="checkmark-outline" size={24} color="#A78BFA" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="create-outline" size={24} color="#A78BFA" />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Picture Section */}
          <View style={styles.profileImageContainer}>
            <Avatar source={photo} name={name} size={120} />
            {isEditing && (
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={pickImage}
              >
                <Ionicons name="camera" size={24} color="#A78BFA" />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View style={styles.nameEditContainer}>
              <TextInput
                style={[styles.userName, styles.input]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#8e8ba7"
              />
              <Ionicons
                name="pencil"
                size={20}
                color="#A78BFA"
                style={styles.nameEditIcon}
              />
            </View>
          ) : (
            <Text style={styles.userName}>{name}</Text>
          )}

          {/* User Details Section */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#A78BFA" />
              {isEditing ? (
                <TextInput
                  style={[styles.inputText, styles.input]}
                  value={email}
                  onChangeText={setEmail}
                />
              ) : (
                <Text style={styles.inputText}>{email}</Text>
              )}
            </View>

            <Text style={styles.sectionLabel}>Phone</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={24} color="#A78BFA" />
              {isEditing ? (
                <TextInput
                  style={[styles.inputText, styles.input]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.inputText}>{phoneNumber}</Text>
              )}
            </View>

            <Text style={styles.sectionLabel}>Civil ID</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={24} color="#A78BFA" />
              {isEditing ? (
                <TextInput
                  style={[styles.inputText, styles.input]}
                  value={civilId}
                  onChangeText={setCivilId}
                  keyboardType="numeric"
                  maxLength={12}
                  placeholder="Enter your Civil ID"
                  placeholderTextColor="#8e8ba7"
                />
              ) : (
                <Text style={styles.inputText}>
                  {civilId || "Not provided"}
                </Text>
              )}
            </View>

            <Text style={styles.sectionLabel}>Bank Account</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="wallet-outline" size={24} color="#A78BFA" />
              {isEditing ? (
                <TextInput
                  style={[styles.inputText, styles.input]}
                  value={bankAccount}
                  onChangeText={setBankAccount}
                  keyboardType="numeric"
                  placeholder="Enter your Bank Account number"
                  placeholderTextColor="#8e8ba7"
                />
              ) : (
                <Text style={styles.inputText}>
                  {bankAccount || "Not provided"}
                </Text>
              )}
            </View>

            <Text style={styles.sectionLabel}>PIN Code</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#A78BFA" />
              {isEditing ? (
                <View style={styles.pinInputContainer}>
                  <TextInput
                    style={[styles.inputText, styles.input, styles.pinInput]}
                    value={pinCode}
                    onChangeText={(text) => setPinCode(text.slice(0, 4))}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry={!showPin}
                    placeholder="Enter 4-digit PIN"
                    placeholderTextColor="#8e8ba7"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPin(!showPin)}
                    style={styles.showPinButton}
                  >
                    <Ionicons
                      name={showPin ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="#A78BFA"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.inputText}>
                  {pinCode ? "••••" : "Not provided"}
                </Text>
              )}
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.1)",
    height: Platform.OS === "ios" ? 60 : 70,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E8F0FE",
    textAlign: "center",
    flex: 1,
  },
  editButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 20,
    position: "relative",
  },
  editImageButton: {
    position: "absolute",
    right: "30%",
    bottom: 0,
    backgroundColor: "#E8F0FE",
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#A78BFA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E8F0FE",
    textAlign: "center",
    marginBottom: 30,
  },
  detailsContainer: {
    width: "100%",
  },
  sectionLabel: {
    fontSize: 16,
    color: "#A78BFA",
    marginBottom: 8,
    marginTop: 16,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  inputText: {
    color: "#E8F0FE",
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A78BFA",
    borderRadius: 16,
    padding: 16,
    marginTop: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  input: {
    color: "#E8F0FE",
    padding: 0,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  nameEditIcon: {
    marginLeft: 10,
  },
  editButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editActionButton: {
    padding: 8,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderRadius: 50,
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#E8F0FE",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "#FF4F6D",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  pinInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  pinInput: {
    marginLeft: 0,
    flex: 1,
  },
  showPinButton: {
    padding: 8,
  },
});

export default Profile;
