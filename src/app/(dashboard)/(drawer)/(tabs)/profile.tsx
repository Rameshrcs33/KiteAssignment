import { Text, View } from "react-native";
import React from "react";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../../../../utils/colors";
import Header from "../../../../components/Header";

const profile = () => {
  return (
    <View style={styles.container}>
      <Header title={"Profile"} />

      <Text style={styles.text}>profile</Text>
    </View>
  );
};

export default profile;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  text: {
    color: colors.black,
    fontSize: "16@s",
  },
});
