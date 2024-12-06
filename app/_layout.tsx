import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "Yekan-Bold": require("../assets/fonts/YekanBakhFaNum-Bold.ttf"),
    "Yekan-ExtraBold": require("../assets/fonts/YekanBakhFaNum-ExtraBold.ttf"),
    "Yekan-Light": require("../assets/fonts/YekanBakhFaNum-Light.ttf"),
    "Yekan-Regular": require("../assets/fonts/YekanBakhFaNum-Regular.ttf"),
    "Yekan-SemiBold": require("../assets/fonts/YekanBakhFaNum-SemiBold.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  if (process.env.EXPO_OS === "web") {
    return <Slot />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
