import CarouselSlider from "@/components/CarouselSlider";
import { teamMembers } from "@/components/CarouselSliderData";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function InfoScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const renderCarouselItem = ({ item }: any) => (
    <View style={styles.imageContainer}>
      <Image
        source={item.image}
        style={styles.carouselImage}
        resizeMode="cover"
      />
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.heroContainer}>
          <Animated.Image
            source={{
              uri: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            }}
            style={[
              styles.heroImage,
              { transform: [{ translateY: Animated.multiply(scrollY, 0.2) }] },
            ]}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <View style={styles.whiteBlurOverlay} />
          <Animated.View
            style={[
              styles.heroContent,
              { transform: [{ translateY: Animated.multiply(scrollY, 0.1) }] },
            ]}
          >
            <Text style={styles.heroTitle}>
              Addressing the{" "}
              <Text style={{ color: "#4CAF50" }}>
                Challenges{" "}
                <Text style={{ color: "#000000" }}>Of Modern Agriculture </Text>
              </Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Agriculture today faces unprecedented challenges, from climate
              change to resource depletion. NeuroCrop was built to provide
              solutions to these growing concerns.
            </Text>
            <Text style={styles.teamText}>Bridgeland Team #2002-2</Text>
          </Animated.View>
        </View>
        <View style={styles.meetTheTeamContainer}>
          <Text style={styles.meetTheTeamText}>Meet the Team!</Text>
        </View>
        <View style={styles.carouselContainer}>
          <CarouselSlider itemList={teamMembers} />
        </View>
        <View style={{ height: 150 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  meetTheTeamContainer: {
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    fontSize: 30,
    marginTop: -70,
    backgroundColor: "#fff",
    width: "100%",
  },
  meetTheTeamText: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    paddingTop: 20,
  },
  bottomContainer: {
    backgroundColor: "#fff",
    zIndex: 0,
  },
  heroContainer: {
    height: 500,
    position: "relative",
    backgroundColor: "#fff",
    zIndex: 0,
  },
  heroImage: {
    width: "100%",
    height: "80%",
    position: "absolute",
    zIndex: -1,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "300%",
    top: -20,
    zIndex: -1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  whiteBlurOverlay: {
    position: "absolute",
    width: "100%",
    height: "300%",
    top: -20,
    zIndex: -1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  heroContent: {
    position: "absolute",
    top: "30%",
    left: 20,
    right: 20,
    alignItems: "center",
  },
  carouselContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 50,
    // alignItems: "center",
    // justifyContent: "center",
  },
  imageContainer: {
    width: width * 0.7,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  carouselImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#ffffff",
  },
  memberName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  memberDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    top: -60,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    top: -60,
  },
  teamText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 20,
    top: -50,
  },
});
