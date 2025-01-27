import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const AddBeneficiary = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phoneNumber: "",
    email: "",
  });

  const handleSubmit = () => {
    // TODO: Implement beneficiary addition logic
    console.log("New beneficiary data:", formData);
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Add Beneficiary</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor="#666"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Relationship</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter relationship"
            placeholderTextColor="#666"
            value={formData.relationship}
            onChangeText={(text) =>
              setFormData({ ...formData, relationship: text })
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, phoneNumber: text })
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor="#666"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Beneficiary</Text>
        </TouchableOpacity>
      </ScrollView>
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
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2a2844",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddBeneficiary;
