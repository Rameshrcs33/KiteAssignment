import { colors } from "../../../../utils/colors";
import { Feather, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabNavigator() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.light_grey,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "HOME",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="createevent"
        options={{
          title: "CREATE EVENT",
          tabBarIcon: ({ color }: { color: string }) => (
            <SimpleLineIcons name="event" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="expiredevent"
        options={{
          title: "EXPIRED EVENTS",
          tabBarIcon: ({ color }: { color: string }) => (
            <SimpleLineIcons name="event" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ color }: { color: string }) => (
            <Feather name="smile" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
