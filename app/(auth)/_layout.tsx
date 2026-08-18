import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

import '@/global.css'

export default function AuthGroupLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#ea7a53" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}