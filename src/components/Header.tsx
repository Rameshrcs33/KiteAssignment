import { Feather } from "@expo/vector-icons";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../utils/colors";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const drawerStatus = useDrawerStatus();
  const insets = useSafeAreaInsets();
  const screenTitle = title || route?.name?.toUpperCase() || "DASHBOARD";

  const handleOpenDrawer = () => {
    if (drawerStatus === "closed") {
      navigation.openDrawer();
    } else {
      navigation.closeDrawer();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={handleOpenDrawer}
        >
          <Feather name="menu" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{screenTitle}</Text>
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: colors.blue,
    paddingVertical: "12@s",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "16@s",
    marginTop: "8@s",
  },
  drawerButton: {
    marginRight: "10@s",
    padding: "4@s",
  },
  title: {
    color: colors.white,
    fontSize: "16@s",
    fontWeight: "bold",
    flex: 1,
  },
});
