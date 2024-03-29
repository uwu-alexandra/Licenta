import React, { createContext, useContext, useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5, Entypo, Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import HomeScreen from "./screens/Home";
import SightsScreen from "./screens/Sights";
import MapScreen from "./screens/Map";
import SettingsScreen from "./screens/Settings";
import CameraButton from "./CameraButton";
import RegisterScreen from "./screens/Register";
import LoginScreen from "./screens/Login";
import { colors } from "./Colors";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a context for the user state
const UserContext = createContext();

// Custom hook to access the user context
export const useUser = () => {
  return useContext(UserContext);
};

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainStack = () => {
  const user = useUser();
  return (
    <Tab.Navigator
      screenOptions={{
        showLabel: false,
        style: {
          backgroundColor: "white",
          position: "absolute",
          bottom: 40,
          marginHorizontal: 20,
          height: 60,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowOffset: { width: 10, height: 10 },
          paddingHorizontal: 20,
        },
      }}
    >
      <Tab.Screen
        name={"Home"}
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                position: "absolute",
                top: 20,
              }}
            >
              <Entypo
                name="home"
                size={27}
                color={focused ? colors.focused : colors.unfocused}
              ></Entypo>
            </View>
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name={"Sights"}
        component={SightsScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                position: "absolute",
                top: 20,
              }}
            >
              <FontAwesome5
                name="book"
                size={24}
                color={focused ? colors.focused : colors.unfocused}
              ></FontAwesome5>
            </View>
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name={"Identify"}
        component={CameraButton}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 55,
                height: 55,
                backgroundColor: colors.focused,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: Platform.OS == "ios" ? 50 : 30,
              }}
            >
              <Entypo
                name="camera"
                size={25}
                color="white"
              ></Entypo>
            </View>
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name={"Map"}
        component={MapScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                position: "absolute",
                top: 20,
              }}
            >
              <Entypo
                name="map"
                size={25}
                color={focused ? colors.focused : colors.unfocused}
              ></Entypo>
            </View>
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name={"Settings"}
        component={user ? SettingsScreen : () => null} // Conditionally render SettingsScreen based on user
        listeners={{
          tabPress: (e) => {
            // Prevent navigating to the Settings screen if the user is not logged in
            if (!user.isGuest) {
              e.preventDefault();
              // Show an alert indicating that the functionality is not available
              alert("Functionality not available for guests");
            }
          },
        }}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                position: "absolute",
                top: 20,
              }}
            >
              <Ionicons
                name="settings-sharp"
                size={24}
                color={focused ? colors.focused : colors.unfocused}
              ></Ionicons>
            </View>
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  const onAuthStateChangedHandler = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedHandler);
    return unsubscribe;
  }, []);

  // Provide the user state through context
  return (
    <UserContext.Provider value={user}>
      <Stack.Navigator>
        {user ? (
          // Render MainStack if the user is logged in
          <Stack.Screen
            name="Main"
            component={MainStack}
            options={{ headerShown: false }}
          />
        ) : (
          // Render AuthStack if the user is not logged in
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </UserContext.Provider>
  );
}
