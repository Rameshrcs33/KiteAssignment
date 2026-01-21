import Drawer from "expo-router/drawer";
import React, { useEffect } from "react";
import { useRouter, useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import CustomDrawer from "../../../utils/CustomDrawer";
import { colors } from "../../../utils/colors";
import { logout } from "../../../redux/reducer/authSlice";
import { showConfirmAlert } from "../../../components/SuccessAlert";

export default function DrawerLayout() {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation?.addListener("beforeRemove", (e: any) => {
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault();

        showConfirmAlert({
          title: "Logout",
          message: "Are you sure you want to logout?",
          onConfirm: () => {
            dispatch(logout());
            router.replace("/(auth)/login");
          },
        });
      }
    });

    return unsubscribe;
  }, [navigation, dispatch, router]);

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colors.blue },
        headerTintColor: colors.white,
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
