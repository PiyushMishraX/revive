import { tabs } from "@/constants/data"
import { Tabs } from "expo-router"
import { View } from "react-native";
import clsx from "clsx"
import {Image} from "expo-image"

// const TabLayout = () => {
//     return <Tabs></Tabs>
// }

// const TabLayout = () => (
//     <Tabs screenOptions={{headerShown: false}}>
//         <Tabs.Screen name="index" options={{ title: 'Home'}} />
//         <Tabs.Screen name="subscription" options={{ title: 'Subscription'}} />
//         <Tabs.Screen name="insights" options={{ title: 'Insights'}} />
//         <Tabs.Screen name="settings" options={{ title: 'Settings'}} />
//         <Tabs.Screen name="subscriptions/[id]" options={{ href: null }} /> {/* Hidden from bottom navigation bar  */}
//     </Tabs>
// )


// clsx to join different classes together
const TabLayout = () => {
    const TabIcon = ({focused, icon}: TabIconProps) => {
        return (
            <View className="tabs-icon">
                <View className={clsx('tabs-pill', focused &&
                'tabs-active')}>
                    <Image source={icon} className="tabs-glyph"/>
                </View>
            </View>
        );
    };

    return (
        <Tabs screenOptions={{headerShown: false}}>
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({focused}) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        )
                    }}/>
            ))}
        </Tabs>
    )
}

export default TabLayout;