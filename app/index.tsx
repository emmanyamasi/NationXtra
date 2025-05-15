// index.tsx
import CustomSplashScreen from '@/assets/components/SplashScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../src/assets/themes/ThemeContext';
import VideoFeedScreen from './videoFeedScreen';
// Import your SplashScreen component

const Tab = createBottomTabNavigator();

// Custom add button for the center tab
const AddButton = () => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.addButtonContainer, { backgroundColor: theme.colors.primary }]}
      onPress={() => alert('Create post functionality coming soon!')}
    >
      <FontAwesome name="plus" size={22} color="#fff" />
    </TouchableOpacity>
  );
};

// Wrapper for SplashScreen that handles the onFinish prop
const SplashScreenWrapper = () => {
  const [splashFinished, setSplashFinished] = useState(false);
  const { theme } = useTheme();
  
  // If splash is finished, show a simple home screen
  if (splashFinished) {
    return (
      <View style={[styles.homeScreen, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text, fontSize: 20, fontFamily: 'Inter-Bold' }}>
          Welcome to NationXtra
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 16, marginTop: 10 }}>
          Explore the latest videos in the Discover tab!
        </Text>
      </View>
    );
  }
  
  // Otherwise show the splash screen
  return (
    <CustomSplashScreen onFinish={() => setSplashFinished(true)} />
  );
};

export default function App() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or initial data fetch
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading NationXtra...
        </Text>
      </SafeAreaView>
    );
  }

  // Return just the Tab Navigator without wrapping it in NavigationContainer
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={SplashScreenWrapper}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Discover"
        component={VideoFeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="compass" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Create"
        component={EmptyScreen}
        options={{
          tabBarButton: (props) => <AddButton {...props} />,
        }}
      />
      
      <Tab.Screen
        name="Notifications"
        component={EmptyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bell" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={EmptyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Placeholder screen component
const EmptyScreen = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.emptyScreen, { backgroundColor: theme.colors.background }]}>
      <Text style={{ color: theme.colors.text, fontSize: 16 }}>
        Coming soon!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  emptyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  addButtonContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2d2d40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 5,
  },
});