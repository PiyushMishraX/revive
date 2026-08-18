import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useSignIn, useAuth } from '@clerk/expo';
import clsx from 'clsx';

const SafeAreaView = styled(RNSafeAreaView);

const SignInScreen = () => {
  const { signIn } = useSignIn();
  const { isLoaded } = useAuth();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<{ emailAddress?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { emailAddress?: string; password?: string } = {};

    if (!emailAddress.trim()) {
      newErrors.emailAddress = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setFormError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const completeSignIn = await signIn.password({
        identifier: emailAddress.trim(),
        password,
      });

      const { error } = completeSignIn;
      if (error) {
        setFormError(
          error.longMessage ||
            error.message ||
            'Please check your email and password and try again.'
        );
        return;
      }

      // Sign-in complete; Clerk updates internal session state automatically.
      // Root layout useEffect picks up useAuth() change and redirects to '/'
      router.replace('/');
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Unable to sign in. Please check your credentials and try again.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = emailAddress.trim() !== '' && password.length >= 6;

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView className="auth-scroll" keyboardShouldPersistTaps="handled" contentContainerClassName="grow">
          <View className="auth-content">
            {/* Brand Block */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">Smart Billing</Text>
                </View>
              </View>
            </View>

            {/* Title */}
            <View className="items-center mt-6">
              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            {/* Form Card */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Form-level error */}
                {formError ? (
                  <View className="rounded-2xl bg-destructive/10 px-4 py-3">
                    <Text className="auth-error">{formError}</Text>
                  </View>
                ) : null}

                {/* Email Field */}
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={clsx('auth-input', errors.emailAddress && 'auth-input-error')}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    value={emailAddress}
                    onChangeText={(text) => {
                      setEmailAddress(text);
                      if (errors.emailAddress) setErrors((prev) => ({ ...prev, emailAddress: undefined }));
                      if (formError) setFormError('');
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    autoComplete="email"
                    editable={!isSubmitting}
                  />
                  {errors.emailAddress ? (
                    <Text className="auth-error">{errors.emailAddress}</Text>
                  ) : null}
                </View>

                {/* Password Field */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <View className="relative">
                    <TextInput
                      className={clsx('auth-input pr-14', errors.password && 'auth-input-error')}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(0, 0, 0, 0.4)"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                        if (formError) setFormError('');
                      }}
                      secureTextEntry={!showPassword}
                      autoCorrect={false}
                      autoCapitalize="none"
                      editable={!isSubmitting}
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-0 bottom-0 justify-center"
                      disabled={isSubmitting}
                    >
                      <Text className="text-sm font-sans-semibold text-accent">
                        {showPassword ? 'Hide' : 'Show'}
                      </Text>
                    </Pressable>
                  </View>
                  {errors.password ? (
                    <Text className="auth-error">{errors.password}</Text>
                  ) : null}
                </View>

                {/* Forgot Password */}
                <View className="items-end">
                  <Pressable disabled={isSubmitting}>
                    <Text className="text-sm font-sans-semibold text-accent">
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>

                {/* Submit Button */}
                <Pressable
                  onPress={handleSignIn}
                  disabled={isSubmitting || !isFormValid}
                  className={clsx('auth-button', (!isFormValid || isSubmitting) && 'auth-button-disabled')}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Sign in</Text>
                  )}
                </Pressable>

                {/* Sign-up Link */}
                <View className="auth-link-row">
                  <Text className="auth-link-copy">New to Recurly?</Text>
                  <Link href="/(auth)/sign-up" disabled={isSubmitting}>
                    <Text className="auth-link">Create an account</Text>
                  </Link>
                </View>
              </View>
            </View>

            {/* CAPTCHA placeholder for web */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;