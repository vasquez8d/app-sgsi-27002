import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

// Screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TeamScreen from '../screens/Team/TeamScreen';
import ScopeScreen from '../screens/Scope/ScopeScreen';
import AssetsScreen from '../screens/Assets/AssetsScreen';
import PoliciesScreen from '../screens/Policies/PoliciesScreen';
import RisksScreen from '../screens/Risks/RisksScreen';
import ControlsScreen from '../screens/Controls/ControlsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Team') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Assets') {
            iconName = focused ? 'server' : 'server-outline';
          } else if (route.name === 'Controls') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen 
        name="Team" 
        component={TeamScreen}
        options={{ tabBarLabel: 'Equipo' }}
      />
      <Tab.Screen 
        name="Assets" 
        component={AssetsScreen}
        options={{ tabBarLabel: 'Activos' }}
      />
      <Tab.Screen 
        name="Controls" 
        component={ControlsScreen}
        options={{ tabBarLabel: 'Controles' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Scope" component={ScopeScreen} />
        <Stack.Screen name="Policies" component={PoliciesScreen} />
        <Stack.Screen name="Risks" component={RisksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
