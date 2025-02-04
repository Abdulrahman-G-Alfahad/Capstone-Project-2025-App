import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Animated,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { deleteToken, getToken } from "../../api/storage";
import UserContext from "../../context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/auth";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const navigation = useNavigation();
  const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(true);
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false);
  const [lockAnimation] = useState(new Animated.Value(0));
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");

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

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["user", user],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.user.fullName);
      setPhoneNumber(profile.user.phoneNumber);
      setEmail(profile.user.email);
      setPhoto(profile.user.photo);
    }
  }, [profile]);

  const toggleFaceId = () => {
    setIsFaceIdEnabled((previousState) => !previousState);
  };

  const togglePrivacy = () => {
    setIsPrivacyEnabled((previousState) => !previousState);
    Animated.spring(lockAnimation, {
      toValue: !isPrivacyEnabled ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const lockRotation = lockAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

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
        <Text style={styles.errorText}>Error loading profile: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#fff" />
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
              <Ionicons name="checkmark-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Content */}
      <View style={styles.content}>
        {/* Profile Picture Section */}
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: photo }} style={styles.profileImage} />
          {isEditing && (
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={24} color="#6B5CE7" />
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
              color="#8e8ba7"
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
            <Ionicons name="mail-outline" size={24} color="#8e8ba7" />
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
            <Ionicons name="call-outline" size={24} color="#8e8ba7" />
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

          <Text style={styles.sectionLabel}>Face ID</Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchLeft}>
              <Ionicons name="scan-outline" size={24} color="#8e8ba7" />
              <Text style={styles.switchText}>Face ID Authentication</Text>
            </View>
            <Switch
              value={isFaceIdEnabled}
              onValueChange={toggleFaceId}
              trackColor={{ false: "#767577", true: "#FF4F6D" }}
              thumbColor={"#f4f3f4"}
            />
          </View>

          <Text style={styles.sectionLabel}>Transactions Privacy</Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchLeft}>
              <Animated.View style={{ transform: [{ rotate: lockRotation }] }}>
                <Ionicons
                  name={
                    isPrivacyEnabled
                      ? "lock-closed-outline"
                      : "lock-open-outline"
                  }
                  size={24}
                  color="#8e8ba7"
                />
              </Animated.View>
              <Text style={styles.switchText}>
                {isPrivacyEnabled ? "Private" : "Public"}
              </Text>
            </View>
            <Switch
              value={isPrivacyEnabled}
              onValueChange={togglePrivacy}
              trackColor={{ false: "#767577", true: "#FF4F6D" }}
              thumbColor={"#f4f3f4"}
            />
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
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
    paddingBottom: 20,
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
    textAlign: "center",
    color: "#fff",
  },
  editButton: {
    position: "absolute",
    right: 16,
    top: 52,
    padding: 8,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginVertical: -3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2a2844",
    marginBottom: 15,
  },
  editImageButton: {
    position: "absolute",
    right: -10,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    color: "#8e8ba7",
    marginBottom: 8,
    marginTop: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2844",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  inputText: {
    color: "#fff",
    marginLeft: 12,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a2844",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    color: "#8e8ba7",
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4F6D",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    padding: 0,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  nameEditIcon: {
    marginLeft: 10,
  },
  editButtonsContainer: {
    position: "absolute",
    right: 16,
    top: 52,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  editActionButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "#ff4f6d",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Profile;
