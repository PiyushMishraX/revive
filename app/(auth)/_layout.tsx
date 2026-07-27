import { Stack } from "expo-router";

import '@/global.css'


export default function RootLayout() {
  return <Stack screenOptions={{headerShown: false}} />; // blanck scree
}

// _layout is shared layout now all routes inside auth will have this same layout inside this file