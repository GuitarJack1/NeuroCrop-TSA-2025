import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Linking, Platform, StyleSheet, TouchableOpacity } from "react-native";

// Mapping of disease names to their info URLs

interface StringDictionary {
  [key: string]: string; // This is the index signature: keys are strings, values are strings
}

const diseaseWebsites: StringDictionary = {
  "Apple Healthy": "https://www.almanac.com/plant/apples",
  "Apple Apple Scab":
    "https://extension.umn.edu/plant-diseases/apple-scab#:~:text=Quick%20facts&text=Scab%20is%20caused%20by%20a,many%20years%20in%20a%20row.",
  "Apple Black Rot":
    "https://extension.wvu.edu/lawn-gardening-pests/plant-disease/tree-fruit-disease/black-rot-disease-in-apples#:~:text=Black%20rot%20disease%2C%20caused%20by,varieties%20are%20the%20preferred%20hosts.",
  "Apple Cedar Apple Rust":
    "https://mortonarb.org/plant-and-protect/tree-plant-care/plant-care-resources/cedar-apple-rust/#:~:text=Cedar-apple%20rust%20is%20the,the%20survival%20of%20the%20fungus.",
  "Bell Pepper Healthy":
    "https://www.gardentech.com/blog/garden-and-lawn-protection/growing-your-own-bell-peppers#:~:text=Depending%20on%20your%20chosen%20varieties,on%20the%20vine%20whenever%20possible.",
  "Bell Pepper Bacterial Spot":
    "https://extension.wvu.edu/lawn-gardening-pests/plant-disease/fruit-vegetable-diseases/bacterial-leaf-spot-of-pepper#:~:text=Bacterial%20leaf%20spot%2C%20caused%20by,2005).",
  "Cherry Healthy": "https://www.almanac.com/plant/cherries",
  "Cherry Powdery Mildew":
    "https://treefruit.wsu.edu/crop-protection/disease-management/cherry-powdery-mildew/#:~:text=Powdery%20mildew%20of%20sweet%20and,1).",
  "Corn (Maize) Healthy": "https://ohioline.osu.edu/factsheet/anr-0148",
  "Corn (Maize) Cercospora Leaf Spot":
    "https://cropprotectionnetwork.org/encyclopedia/gray-leaf-spot-of-corn#:~:text=Gray%20leaf%20spot%2C%20caused%20by,to%20three%20weeks%20before%20tasseling.",
  "Corn (Maize) Common Rust":
    "https://extension.umn.edu/corn-pest-management/common-rust-corn#:~:text=Common%20rust%20frequently%20occurs%20in,the%20appearance%20of%20brown%20pustules.",
  "Corn (Maize) Northern Leaf Blight":
    "https://extension.umn.edu/corn-pest-management/northern-corn-leaf-blight#:~:text=Northern%20corn%20leaf%20blight%20occurs,hybrids%20are%20infected%20before%20silking.",
  "Grape Healthy":
    "https://wineserver.ucdavis.edu/viticulture-grape-growing-information",
  "Grape Black Rot":
    "https://extension.psu.edu/black-rot-on-grapes-in-home-gardens",
  "Grape Esca (Black Measles)":
    "https://ipm.ucanr.edu/agriculture/grape/esca-black-measles/#gsc.tab=0",
  "Grape Leaf Blight":
    "https://apps.extension.umn.edu/garden/diagnose/plant/fruit/grape/leavesspots.html",
  "Peach Healthy": "https://www.britannica.com/plant/peach",
  "Peach Bacterial Spot":
    "https://www.aces.edu/blog/topics/crop-production/bacterial-spot-treatment-in-peaches/#:~:text=Symptoms%20of%20bacterial%20spot%20are,angular%20appearance%20(figure%201).",
  "Potato Healthy": "https://www.almanac.com/plant/potatoes",
  "Potato Early Blight":
    "https://ipm.cahnr.uconn.edu/early-blight-and-late-blight-of-potato/#:~:text=Early%20blight%20of%20potato%20is,affects%20young%2C%20vigorously%20growing%20plants.",
  "Potato Late Blight":
    "https://ipm.cahnr.uconn.edu/early-blight-and-late-blight-of-potato/#:~:text=Early%20blight%20of%20potato%20is,affects%20young%2C%20vigorously%20growing%20plants.",
  "Strawberry Healthy":
    "https://bonnieplants.com/blogs/how-to-grow/growing-strawberries",
  "Strawberry Leaf Scorch":
    "https://ipm.ucanr.edu/PMG/GARDEN/FRUIT/DISEASE/leafscorch.html#:~:text=Leaf%20scorch%20causes%20brown%20to,%2C%20temperature%2C%20and%20other%20factors.",
  "Tomato Healthy":
    "https://extension.unh.edu/resource/growing-vegetables-tomatoes-fact-sheet-1",
  "Tomato Bacterial Spot":
    "https://hort.extension.wisc.edu/articles/bacterial-spot-of-tomato/#:~:text=Bacterial%20spot%20can%20affect%20all,brownish-red%20as%20they%20age.",
  "Tomato Early Blight":
    "https://extension.umd.edu/resource/early-blight-tomatoes/",
  "Tomato Late Blight": "https://www.rhs.org.uk/disease/tomato-blight",
  "Tomato Septoria Leaf Spot":
    "https://portal.ct.gov/caes/fact-sheets/plant-pathology/septoria-leaf-spot-of-tomato#:~:text=Septoria%20leaf%20spot%20is%20caused,%2C%20stems%2C%20and%20the%20calyx.",
  "Tomato Yellow Leaf Curl Virus":
    "https://agriculture.vic.gov.au/biosecurity/plant-diseases/vegetable-diseases/tomato-yellow-leaf-curl-virus#:~:text=Tomato%20yellow%20leaf%20curl%20virus%20(TYLCV)%20can%20infect%20over%2030,silverleaf%20whitefly%20(Bemisia%20tabaci).",
  "Cassava Bacterial Blight (CBB)":
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC8578842/#:~:text=Cassava%20bacterial%20blight%20(CBB)%20is,and%20the%20crop%20are%20limited.",
  "Cassava Brown Streak Disease (CBSD)":
    "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/cassava-brown-streak-virus",
  "Cassava Green Mottle (CGM)":
    "https://plantwiseplusknowledgebank.org/doi/10.1079/pwkb.20227800039",
  "Cassava Mosaic Disease (CMD)":
    "https://farmonaut.com/blogs/cassava-mosaic-disease-symptoms-treatment-and-organic-control-methods-for-infected-plants/#:~:text=Cassava%20Mosaic%20Disease%20is%20a,as%20vectors%20for%20the%20virus.",
  Healthy: "https://plants.usda.gov/DocumentLibrary/plantguide/pdf/pg_maes.pdf",
};

export default function ModalScreen() {
  // Get the outputDisease parameter from the route
  let { outputDisease } = useLocalSearchParams<{ outputDisease: string }>();

  //console.log(outputDisease);

  return (
    <View style={styles.container}>
      {/* Show "Disease:" unless the result is healthy */}
      <Text style={styles.title}>AI Disease Status:</Text>
      {/* Display the disease name */}
      <Text style={styles.disease_text}>{outputDisease}</Text>

      <TouchableOpacity
        onPress={() => {
          Linking.openURL(diseaseWebsites[outputDisease]);
        }}
      >
        <Text style={styles.learn_more_text}>Learn More...</Text>
      </TouchableOpacity>

      {/* Set status bar style based on platform */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

// Basic styling for the modal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 300,
  },
  disease_text: { color: "black", fontSize: 15, marginTop: 8 },
  learn_more_text: { color: "blue", fontSize: 15, marginTop: 5 },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
