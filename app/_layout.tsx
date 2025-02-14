import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import theme from "@/config/theme";
import { PaperProvider } from "react-native-paper";

export default function Layout() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F2F2F2" }}>
        <ActivityIndicator size="large" color={theme.colors.tertiary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgotPassword" />
          </>
        ) : (
          <>
            <Stack.Screen name="home" />
            <Stack.Screen name="profile" />
          </>
        )}
      </Stack>
    </PaperProvider>
  );
}