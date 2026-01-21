import { Feather } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducer/authSlice";
import { showConfirmAlert } from "../components/SuccessAlert";
import { RootState } from "../redux/store";
import { colors } from "./colors";

export default function CustomDrawer(props: any) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    showConfirmAlert({
      title: "Logout",
      message: "Are you sure you want to logout?",
      onConfirm: () => {
        dispatch(logout());
        router.replace("/(auth)/login");
      },
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      {user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.fullName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.mobile}>{user.mobileNumber}</Text>
        </View>
      )}
      <DrawerItem
        label="Logout"
        icon={({ color, size }) => (
          <Feather name="log-out" size={size} color={color} />
        )}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  userInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_grey,
    marginBottom: 16,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 6,
  },
  mobile: {
    fontSize: 14,
    color: colors.black,
  },
});
