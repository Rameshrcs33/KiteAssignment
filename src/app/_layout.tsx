import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Stack } from "expo-router";
import { persistor, store } from "../redux/store";
import { StatusBar, View } from "react-native";
import { colors } from "../utils/colors";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{ flex: 1 }}>
          <StatusBar backgroundColor={colors.blue} barStyle={"default"} />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </PersistGate>
    </Provider>
  );
}
