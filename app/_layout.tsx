import CustomSplashScreen from '@/assets/components/SplashScreen';
import { ThemeProvider } from '@/assets/themes/ThemeContext';
import * as Font from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        const regularFont = require('@/assets/fonts/Inter-Regular.ttf');
        const boldFont = require('@/assets/fonts/Inter-Bold.ttf');
        if (!regularFont || !boldFont) {
          throw new Error('Font files not found at src/assets/fonts/');
        }
        console.log('Font paths resolved:', regularFont, boldFont);
        await Font.loadAsync({
          'Inter-Regular': regularFont,
          'Inter-Bold': boldFont,
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!appIsReady) {
    return null;
  }

  if (showSplash) {
    return (
      <ThemeProvider>
        <CustomSplashScreen onFinish={handleSplashComplete} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}