import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const OnBoarding = () => {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to",
      subtitle: "FaceBouk",
      description: "No Cards, No Cash—Just You. ",
      image: require("../../../assets/logo2.png"), // Logo
      buttonText: "Get Started",
    },
    {
      title: "Secure Payments.",
      description:
        "Your security is our priority, with facial recognition technology and advanced encryption.",
        image: require("../../../assets/secured.png"), //illustration 1
      buttonText: "Continue",
    },
    {
      title: "Anytime. Anywhere.",
      description:
        "Experience ultimate convenience with our payment system that works seamlessly wherever you are, at any time.",
      image: require("../../../assets/anywhere.png"), //illustration 2
      buttonText: "Continue",
    },
    {
      title: "Manage Household Spending",
      description:
        "Stay in control with tools designed to track and manage expenses, making family budgeting simple and stress-free.",
      image: require("../../../assets/manage.png"), //illustration 3
      buttonText: "Let's Go!",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate("Login");
    }
  };

  const handleSkip = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {currentSlide === 0 ? (
        // Cover Screen
        <View style={styles.slide}>
          <Image source={slides[0].image} style={styles.logo} />
          <Text style={styles.title}>{slides[0].title}</Text>
          <Text style={styles.appName}>{slides[0].subtitle}</Text>
          <Text style={styles.description}>{slides[0].description}</Text>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{slides[0].buttonText}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Other Slides
        <View style={styles.slide}>
          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>

          <Image source={slides[currentSlide].image} style={styles.image} />
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.description}>
            {slides[currentSlide].description}
          </Text>
          <View style={styles.paginationContainer}>
            {slides.slice(1).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      index === currentSlide - 1 ? "#0D9488" : "#444",
                    marginVertical: 4,
                    height: index === currentSlide - 1 ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {slides[currentSlide].buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 250,
    position: "relative",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    backgroundColor: "#E9ECEF",
    borderRadius: 20,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0D9488",
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  description: {
    fontSize: 16,
    color: "#A0A0A0",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  button: {
    backgroundColor: "#A78BFA",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    width: "90%",
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  skipButton: {
    position: "absolute",
    top: 85,
    right: 25,
  },
  skipText: {
    color: "#A78BFA",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    textDecorationLine: "underline",
  },
  paginationContainer: {
    flexDirection: "column",
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -30 }],
  },
  paginationDot: {
    width: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
});

export default OnBoarding;
