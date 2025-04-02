import AIDropdown from "@/components/AIDropdown";
import { View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function AIScreen() {
  const [image, setImage] = useState<string | null>(null);
  let imageWidth: number;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>(
    "Select Detection Type"
  );

  const uploadImage = async () => {
    if (selectedText != "Select Detection Type") {
      Alert.alert("Upload Image", "Choose an option", [
        { text: "Take a photo", onPress: takePhoto },
        { text: "Pick from gallery", onPress: pickImage },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      Alert.alert("Please Choose a Detection Type");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: selectedText == "General AI Disease Detection" ? [4, 3] : [1, 1],
      quality: 0,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: selectedText == "General AI Disease Detection" ? [4, 3] : [1, 1],
      quality: 0,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      imageWidth = result.assets[0].width;
    }
  };

  const detectDiseasesWithAI = async (imageUri: string): Promise<void> => {
    setLoading(true);
    try {
      // Resize and compress the image
      const resizedImage = await manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: selectedText == "General AI Disease Detection" ? 800 : 224,
              height:
                selectedText == "General AI Disease Detection" ? 400 : 224,
            },
          },
        ],
        { format: SaveFormat.JPEG }
      );

      // Fetch and convert the resized image to base64
      const response = await fetch(resizedImage.uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(",")[1];

        if (!base64data) {
          console.error("Failed to convert image to base64.");
          return;
        }

        // Send the request to the AI

        setLoading(false);
      };
    } catch (error) {
      console.error("Error extracting text from image:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.overallContainer}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/tsa_agriculture_icon.png")}
          style={styles.topImage}
        />

        <View style={styles.dropDownContainer}>
          <AIDropdown
            onSelect={(selected: string) => {
              setSelectedText(selected);
              setImage(null);
            }}
            colors={{
              background: "#ffffff",
              text: "#409443",
              border: "#388E3C",
              highlight: "#A5D6A7",
            }}
          />
        </View>

        <Text style={styles.uploadTitle}>Upload Image</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={uploadImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Ionicons name="cloud-upload-outline" size={50} color="#00114D" />
          )}
        </TouchableOpacity>

        {image && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              detectDiseasesWithAI(image);
            }}
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                color="white"
                style={styles.loader}
              />
            ) : (
              <Text style={styles.buttonText}>DETECT</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropDownContainer: {
    top: 320,
    position: "absolute",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  overallContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    width: "100%",
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  topImage: {
    width: "90%",
    top: 40,
    height: 320,
    position: "absolute",
  },
  bottomImage: {
    width: 100,
    height: 20,
    position: "absolute",
    bottom: 95,
  },
  uploadTitle: {
    fontSize: 30,
    color: "#409443",
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 250,
  },
  uploadBox: {
    width: 280,
    height: 180,
    backgroundColor: "#ccd6c9bb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 4,
    borderColor: "#409443",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  loader: {},
  button: {
    width: 280,
    backgroundColor: "#409443",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
