import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Avatar = ({ source, name, size = 120, style }) => {
  const getInitials = (fullName) => {
    if (!fullName) return "";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const containerSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const textSize = {
    fontSize: size / 3,
  };

  return source ? (
    <Image
      source={{ uri: source }}
      style={[styles.image, containerSize, style]}
    />
  ) : (
    <View style={[styles.avatarContainer, containerSize, style]}>
      <Text style={[styles.avatarText, textSize]}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderWidth: 2,
    borderColor: "#A78BFA",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarContainer: {
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderWidth: 2,
    borderColor: "#A78BFA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    color: "#A78BFA",
    fontWeight: "700",
  },
});

export default Avatar;
