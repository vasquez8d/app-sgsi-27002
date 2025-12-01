import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform, TouchableOpacity } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import AlcanceDashboard from '../screens/Scope/AlcanceDashboard';
import RisksScreen from '../screens/Risks/RisksScreen';
import ControlsScreen from '../screens/Controls/ControlsScreen';
import PoliciesScreen from '../screens/Policies/PoliciesScreen';
import TeamScreen from '../screens/Team/TeamScreen';
import AssetsScreen from '../screens/Assets/AssetsScreen';
import { ALCANCE_THEME } from '../utils/alcanceConstants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 * Stack Navigator para el Dashboard
 * Permite navegar a Team y Assets manteniendo el tab bar visible
 */
const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: ALCANCE_THEME.colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="DashboardHome" 
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Team" 
        component={TeamScreen}
        options={({ navigation }) => ({
          title: 'Equipo de Proyecto',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Assets" 
        component={AssetsScreen}
        options={({ navigation }) => ({
          title: 'Activos de Información',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

/**
 * Bottom Tab Navigator principal estilo Instagram
 * Permite navegación rápida entre los módulos principales de la app SGSI
 */
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Alcance':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Riesgos':
              iconName = focused ? 'alert-circle' : 'alert-circle-outline';
              break;
            case 'Controles':
              iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
              break;
            case 'Políticas':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: ALCANCE_THEME.colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -2,
        },
        headerStyle: {
          backgroundColor: ALCANCE_THEME.colors.primary,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Alcance" 
        component={AlcanceDashboard}
        options={{
          title: 'Gestión del Alcance',
          tabBarLabel: 'Alcance',
        }}
      />
      <Tab.Screen 
        name="Riesgos" 
        component={RisksScreen}
        options={{
          title: 'Gestión de Riesgos',
          tabBarLabel: 'Riesgos',
        }}
      />
      <Tab.Screen 
        name="Controles" 
        component={ControlsScreen}
        options={{
          title: 'Controles ISO 27002',
          tabBarLabel: 'Controles',
        }}
      />
      <Tab.Screen 
        name="Políticas" 
        component={PoliciesScreen}
        options={{
          title: 'Políticas y Documentos',
          tabBarLabel: 'Políticas',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
