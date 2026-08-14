import "@/global.css"
import { Link } from "expo-router";
import { Text, View, Image, FlatList } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images"
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useState } from "react";
 
const SafeAreaView = styled(RNSafeAreaView);

// export default function App() {
const Home = () => {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  return (
    // <View className="flex-1 items-center justify-center bg-background">
    // <SafeAreaView className="flex-1 bg-background p-5">

      // {/* <Text className="text-5xl font-sans-extrabold text-success">Home</Text> */}
      // {/* <Text className="text-7xl font-bold text-success">Home</Text> */}

      // {/* <Link href="/onboarding" className="mt-4 font-sans-bold rounded bg-primary text-white p-4" >Go to Onboarding</Link>
      // <Link href="/(auth)/sign-in" className="mt-4 font-sans-bold rounded bg-primary text-white p-4" >Go to Sign in</Link>
      // <Link href="/(auth)/sign-up" className="mt-4 font-sans-bold rounded bg-primary text-white p-4" >Go to Sign up</Link> */}

      // {/* <Link href="/subscriptions/spotify">Spotify SUbscription</Link>
      // <Link
      //   href={{
      //     pathname: "/subscriptions/[id]",
      //     params: { id: "chatgpt" },
      //   }}
      //   >
      //   GPT pro subscriptions
      // </Link> */}


    // </SafeAreaView>
    // </View>

    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="home-header">
          <View className="home-user">
            <Image source={images.avatar} className="home-avatar" />
            <Text className="home-user-name">{HOME_USER.name}</Text>
          </View>

            <Image source={icons.add} className="home-add-icon" />
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>

        <View className="home-balance-row" >
          <Text className="home-balance-amout">
            {formatCurrency( HOME_BALANCE.amount)}
          </Text>
          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
          </Text>
        </View>
      </View>

      <View >
        <ListHeading title="Upcoming"/>
        {/* <UpcomingSubscriptionCard data={UPCOMING_SUBSCRIPTIONS[0]} /> */}
        <FlatList 
          data={UPCOMING_SUBSCRIPTIONS}
          renderItem={({ item })=>(
            <UpcomingSubscriptionCard {...item} />
          )}
          keyExtractor={(item)=> item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Text className="home-empty-state">No upcoming renewls yet...</Text>}
        />
      </View>

      <View >
        <ListHeading title="All Subscription"/>
        {/* <SubscriptionCard 
          {...HOME_SUBSCRIPTIONS[0]}
          expanded={expandedSubscriptionId === HOME_SUBSCRIPTIONS[0].id}
          onPress={()=> setExpandedSubscriptionId((currentId) => ( currentId === HOME_SUBSCRIPTIONS[0].id ? null : HOME_SUBSCRIPTIONS[0].id))}
        /> */}
        <FlatList data={HOME_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={( { item }) =>( 
            <SubscriptionCard { ...item} expanded={expandedSubscriptionId === item.id}
            onPress={()=> setExpandedSubscriptionId((currentId)=> (currentId === item.id ? null : item.id))}
            />
          )} 
          extraData = { expandedSubscriptionId}
          ItemSeparatorComponent={()=> <View className="h-4" />}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </SafeAreaView>

  );
}

// Moving the index.tsx too // its our home tab , index.tsx maps to root of the root , if it isn't in app still it would be reached


export default Home