import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useSignUp, useAuth } from '@clerk/expo';
import clsx from 'clsx';

const SafeAreaView = styled(RNSafeAreaView);

type Step = 'form' | 'verify';

const SignUpScreen = () => {
  const { signUp } = useSignUp();
  const { isLoaded } = useAuth();

  const [step, setStep] = useState<Step>('form');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<{
    emailAddress?: string;
    password?: string;
    confirmPassword?: string;
    code?: string;
  }>({});

  const validateSignUpForm = () => {
    const newErrors: typeof errors = {};

    if (!emailAddress.trim()) {
      newErrors.emailAddress = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please create a password';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z\d])/.test(password)) {
      newErrors.password = 'Include a number or uppercase letter for security';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCode = () => {
    const newErrors: typeof errors = {};

    if (!code.trim()) {
      newErrors.code = 'Please enter the verification code';
    } else if (code.replace(/\D/g, '').length < 6) {
      newErrors.code = 'Enter the 6-digit code sent to your email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!isLoaded) return;
    setFormError('');

    if (!validateSignUpForm()) return;

    setIsSubmitting(true);

    try {
      const { error: createError } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (createError) {
        setFormError(
          createError.longMessage ||
            createError.message ||
            'Unable to create an account. Please try again.'
        );
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setFormError(
          sendError.longMessage ||
            sendError.message ||
            'Unable to send verification code. Please try again.'
        );
        return;
      }

      setStep('verify');
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Unable to create an account. Please try again.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    setFormError('');

    if (!validateCode()) return;

    setIsVerifying(true);

    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({
        code: code.replace(/\D/g, ''),
      });

      if (verifyError) {
        setFormError(
          verifyError.longMessage ||
            verifyError.message ||
            'Invalid verification code. Please check and try again.'
        );
        return;
      }

      const { error: finalizeError } = await signUp.finalize();

      if (finalizeError) {
        setFormError(
          finalizeError.longMessage ||
            finalizeError.message ||
            'Verification incomplete. Please try again.'
        );
        return;
      }

      // Sign-up + verification complete; Clerk updates internal session state.
      // Root layout useEffect picks up useAuth() change and redirects to '/'
      router.replace('/');
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Invalid verification code. Please check and try again.';
      setFormError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;
    setFormError('');
    try {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) {
        setFormError(error.longMessage || error.message || 'Unable to resend code.');
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Unable to resend code.';
      setFormError(message);
    }
  };

  const handleBackToForm = () => {
    setStep('form');
    setCode('');
    setErrors({});
    setFormError('');
  };

  const isFormValid =
    emailAddress.trim() !== '' &&
    password.length >= 8 &&
    confirmPassword === password &&
    confirmPassword.length > 0;

  const isCodeValid = code.replace(/\D/g, '').length >= 6;

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

            {step === 'form' ? (
              <>
                {/* Title */}
                <View className="items-center mt-6">
                  <Text className="auth-title">Create your account</Text>
                  <Text className="auth-subtitle">
                    Start tracking and managing all your subscriptions in one place
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
                          if (errors.emailAddress)
                            setErrors((prev) => ({ ...prev, emailAddress: undefined }));
                          if (formError) setFormError('');
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        autoComplete="email"
                        editable={!isSubmitting}
                      />
                      {errors.emailAddress ? <Text className="auth-error">{errors.emailAddress}</Text> : null}
                    </View>

                    {/* Password Field */}
                    <View className="auth-field">
                      <Text className="auth-label">Password</Text>
                      <View className="relative">
                        <TextInput
                          className={clsx('auth-input pr-14', errors.password && 'auth-input-error')}
                          placeholder="Create a password"
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
                      {errors.password ? <Text className="auth-error">{errors.password}</Text> : null}
                      {!errors.password && password ? (
                        <Text className="auth-helper">Use 8+ characters with a number or uppercase letter</Text>
                      ) : null}
                    </View>

                    {/* Confirm Password Field */}
                    <View className="auth-field">
                      <Text className="auth-label">Confirm password</Text>
                      <TextInput
                        className={clsx('auth-input', errors.confirmPassword && 'auth-input-error')}
                        placeholder="Re-enter your password"
                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          if (errors.confirmPassword)
                            setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                          if (formError) setFormError('');
                        }}
                        secureTextEntry={!showPassword}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={!isSubmitting}
                      />
                      {errors.confirmPassword ? (
                        <Text className="auth-error">{errors.confirmPassword}</Text>
                      ) : null}
                    </View>

                    {/* Submit Button */}
                    <Pressable
                      onPress={handleSignUp}
                      disabled={isSubmitting || !isFormValid}
                      className={clsx(
                        'auth-button',
                        (!isFormValid || isSubmitting) && 'auth-button-disabled'
                      )}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator size="small" color="#081126" />
                      ) : (
                        <Text className="auth-button-text">Create account</Text>
                      )}
                    </Pressable>

                    {/* Sign-in Link */}
                    <View className="auth-link-row">
                      <Text className="auth-link-copy">Already have an account?</Text>
                      <Link href="/(auth)/sign-in" disabled={isSubmitting}>
                        <Text className="auth-link">Sign in</Text>
                      </Link>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Verify Title */}
                <View className="items-center mt-6">
                  <Text className="auth-title">Verify your email</Text>
                  <Text className="auth-subtitle">
                    We sent a 6-digit verification code to{' '}
                    <Text className="font-sans-bold text-primary">{emailAddress}</Text>
                  </Text>
                </View>

                {/* Verification Card */}
                <View className="auth-card">
                  <View className="auth-form">
                    {/* Form-level error */}
                    {formError ? (
                      <View className="rounded-2xl bg-destructive/10 px-4 py-3">
                        <Text className="auth-error">{formError}</Text>
                      </View>
                    ) : null}

                    {/* Code Field */}
                    <View className="auth-field">
                      <Text className="auth-label">Verification code</Text>
                      <TextInput
                        className={clsx('auth-input', errors.code && 'auth-input-error')}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                        value={code}
                        onChangeText={(text) => {
                          const digits = text.replace(/\D/g, '').slice(0, 6);
                          setCode(digits);
                          if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }));
                          if (formError) setFormError('');
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!isVerifying}
                        autoComplete="one-time-code"
                      />
                      {errors.code ? <Text className="auth-error">{errors.code}</Text> : null}
                    </View>

                    {/* Verify Button */}
                    <Pressable
                      onPress={handleVerify}
                      disabled={isVerifying || !isCodeValid}
                      className={clsx(
                        'auth-button',
                        (!isCodeValid || isVerifying) && 'auth-button-disabled'
                      )}
                    >
                      {isVerifying ? (
                        <ActivityIndicator size="small" color="#081126" />
                      ) : (
                        <Text className="auth-button-text">Verify email</Text>
                      )}
                    </Pressable>

                    {/* Resend & Back */}
                    <View className="gap-3 mt-2">
                      <Pressable onPress={handleResendCode} disabled={isVerifying}>
                        <Text className="text-center text-sm font-sans-semibold text-accent">
                          Resend verification code
                        </Text>
                      </Pressable>
                      <Pressable onPress={handleBackToForm} disabled={isVerifying}>
                        <Text className="text-center text-sm font-sans-semibold text-muted-foreground">
                          ← Use a different email address
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </>
            )}

            {/* CAPTCHA placeholder for web */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;