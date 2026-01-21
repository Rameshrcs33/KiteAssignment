import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function WelcomeScreen() {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);

  useFocusEffect(
    useCallback(() => {
      let timer: number = 0;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (authState.isLoggedIn && authState.user) {
          router.push("/(dashboard)/(drawer)/(tabs)/home");
        } else {
          router.push("/(auth)/login");
        }
      }, 1000);
    }, [authState.isLoggedIn, authState.user, router]),
  );

  return null;
}
