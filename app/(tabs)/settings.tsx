import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useAuth, useUser } from '@clerk/expo';
import clsx from 'clsx';
import { Image } from 'expo-image';
import images from '@/constants/images';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (!authLoaded || isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      // Error during sign-out, but session is typically cleared
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayName = user?.fullName || user?.firstName || user?.username || 'Account';
  const displayEmail = user?.primaryEmailAddress?.emailAddress || '';

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* Header */}
      <View className="mb-8 mt-2">
        <Text className="text-3xl font-sans-extrabold text-primary">Settings</Text>
      </View>

      {/* Profile Card */}
      <View className="rounded-3xl border border-border bg-card p-5 mb-5">
        <View className="flex-row items-center gap-4">
          <Image source={images.avatar} className="size-16 rounded-full" />
          <View className="flex-1 min-w-0">
            <Text className="text-xl font-sans-bold text-primary" numberOfLines={1}>
              {displayName}
            </Text>
            {displayEmail ? (
              <Text className="text-sm font-sans-medium text-muted-foreground mt-1" numberOfLines={1}>
                {displayEmail}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Settings Sections */}
      <View className="gap-4">
        <View className="rounded-2xl border border-border bg-card overflow-hidden">
          <View className="px-5 py-4 border-b border-border">
            <Text className="text-base font-sans-semibold text-primary">Profile</Text>
          </View>
          <View className="px-5 py-4 border-b border-border">
            <Text className="text-base font-sans-semibold text-primary">Notifications</Text>
          </View>
          <View className="px-5 py-4">
            <Text className="text-base font-sans-semibold text-primary">Privacy & Security</Text>
          </View>
        </View>

        <View className="rounded-2xl border border-border bg-card overflow-hidden">
          <View className="px-5 py-4 border-b border-border">
            <Text className="text-base font-sans-semibold text-primary">Billing & Plans</Text>
          </View>
          <View className="px-5 py-4">
            <Text className="text-base font-sans-semibold text-primary">Help & Support</Text>
          </View>
        </View>
      </View>

      {/* Sign Out Button */}
      <View className="mt-10">
        <Pressable
          onPress={handleSignOut}
          disabled={isSigningOut || !authLoaded}
          className={clsx(
            'items-center rounded-2xl py-4 border',
            isSigningOut ? 'border-border bg-muted' : 'border-destructive/30 bg-destructive/5'
          )}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color="#dc2626" />
          ) : (
            <Text className={clsx(
              'text-base font-sans-bold',
              isSigningOut ? 'text-muted-foreground' : 'text-destructive'
            )}>
              Sign out
            </Text>
          )}
        </Pressable>
      </View>

      {/* Footer */}
      <View className="mt-auto pt-6 items-center">
        <Text className="text-xs font-sans-medium text-muted-foreground">
          Recurly · Smart Billing
        </Text>
        <Text className="text-xs font-sans-medium text-muted-foreground mt-1">
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;