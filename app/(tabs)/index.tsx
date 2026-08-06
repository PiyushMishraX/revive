import "@/global.css"
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
 
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    // <View className="flex-1 items-center justify-center bg-background">
    <SafeAreaView className="flex-1 bg-background p-5">

      <Text className="text-7xl font-sans-extrabold text-success">Home</Text>
      <Text className="text-7xl font-bold text-success">Home</Text>

      <Link href="/onboarding" className="mt-4 rounded bg-primary text-white p-4" >Go to Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4" >Go to Sign in</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white p-4" >Go to Sign up</Link>

      <Link href="/subscriptions/spotify">Spotify SUbscription</Link>
      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "chatgpt" },
        }}
        >
        GPT pro subscriptions
      </Link>
    </SafeAreaView>
    // </View>
  );
}

// Moving the index.tsx too // its our home tab , index.tsx maps to root of the root , if it isn't in app still it would be reached