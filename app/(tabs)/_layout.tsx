import { tabs } from "@/constants/data"
import { Tabs, useRouter } from "expo-router"
import { View, ActivityIndicator } from "react-native";
import clsx from "clsx"
import {Image} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components } from "@/constants/theme";
import { useAuth } from "@clerk/expo";
import { useEffect } from "react";

const tabBar = components.tabBar;

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
    const insets = useSafeAreaInsets();
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    // Auth guard at the (tabs) group level: NavigationContext is definitely
    // available here, which avoids Expo Router crashes during --tunnel startup.
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace('/(auth)/sign-in');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="#ea7a53" />
            </View>
        );
    }

    const TabIcon = ({focused, icon}: TabIconProps) => {
        return (
            <View className="tabs-icon">
                <View className={clsx('tabs-pill', focused &&
                'tabs-active')}>
                    {/* <Image source={icon} className="tabs-glyph"/>  */}
                    {/* the do not shows icon beacuse the Image component imported is commin from expo-Image instead of react-native  so changing that  */}

                    <Image source={icon} resizeMode="contain" className="tabs-glyph"/>
                </View>
            </View>
        );
    };

    return (
        <Tabs 
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Math.max(insets.bottom,tabBar.horizontalInset ),
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarItemStyle: {
                    paddingVertical: tabBar.height / 2 - tabBar.iconFrame /1.6
                },
                tabBarIconStyle: {
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,
                    alignItems: 'center',
                }
            }}
        >
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

            {/* Per-subscription detail screen. Hidden from tab bar (pushable) */}
            <Tabs.Screen
                name="subscriptions/[id]"
                options={{ href: null }}
            />
        </Tabs>
    );
};

export default TabLayout;