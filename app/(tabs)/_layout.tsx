import { Tabs } from "expo-router"

// const TabLayout = () => {
//     return <Tabs></Tabs>
// }

const TabLayout = () => (
    <Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen name="index" options={{ title: 'Home'}} />
        <Tabs.Screen name="subscription" options={{ title: 'Subscription'}} />
        <Tabs.Screen name="insights" options={{ title: 'Insights'}} />
        <Tabs.Screen name="settings" options={{ title: 'Settings'}} />
        <Tabs.Screen name="subscriptions/[id]" options={{ href: null }} /> {/* Hidden from bottom navigation bar  */}
    </Tabs>
)

export default TabLayout