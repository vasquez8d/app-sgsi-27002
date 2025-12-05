import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALCANCE_THEME } from '../utils/alcanceConstants';

// Screens
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';

// Alcance Module Detail Screens
import ProcesosScreen from '../screens/Scope/ProcesosScreen';
import UnidadesScreen from '../screens/Scope/UnidadesScreen';
import UbicacionesScreen from '../screens/Scope/UbicacionesScreen';
import InfraestructuraScreen from '../screens/Scope/InfraestructuraScreen';
import ExclusionesScreen from '../screens/Scope/ExclusionesScreen';
import ValidacionScreen from '../screens/Scope/ValidacionScreen';
import AlcanceConfigScreen from '../screens/Scope/AlcanceConfigScreen';

// Other Module Screens
import PoliciesScreen from '../screens/Policies/PoliciesScreen';
import RisksScreen from '../screens/Risks/RisksScreen';
import ControlsScreen from '../screens/Controls/ControlsScreen';

const Stack = createStackNavigator();

/**
 * Stack Navigator principal con integración del Bottom Tab Navigator
 * Maneja el flujo de autenticación y navegación entre módulos
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
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
          headerBackTitleVisible: false,
        }}
      >
        {/* Login Screen - Sin header */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        
        {/* Main Tab Navigator - Sin header (tiene su propio header) */}
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        
        {/* Alcance Module Detail Screens - Con botón back */}
        <Stack.Screen 
          name="Procesos" 
          component={ProcesosScreen}
          options={({ navigation }) => ({
            title: 'Procesos y Servicios',
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
          name="Unidades" 
          component={UnidadesScreen}
          options={({ navigation }) => ({
            title: 'Unidades Organizacionales',
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
          name="Ubicaciones" 
          component={UbicacionesScreen}
          options={({ navigation }) => ({
            title: 'Ubicaciones',
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
          name="Infraestructura" 
          component={InfraestructuraScreen}
          options={({ navigation }) => ({
            title: 'Infraestructura Tecnológica',
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
          name="Exclusiones" 
          component={ExclusionesScreen}
          options={({ navigation }) => ({
            title: 'Exclusiones del Alcance',
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
          name="Validacion" 
          component={ValidacionScreen}
          options={({ navigation }) => ({
            title: 'Validación y Aprobación',
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
          name="AlcanceConfig" 
          component={AlcanceConfigScreen}
          options={({ navigation }) => ({
            title: 'Configuración del Alcance',
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
        
        {/* Other Module Screens */}
        <Stack.Screen 
          name="Policies" 
          component={PoliciesScreen}
          options={({ navigation }) => ({
            title: 'Políticas',
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
          name="Risks" 
          component={RisksScreen}
          options={({ navigation }) => ({
            title: 'Riesgos',
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
          name="Controls" 
          component={ControlsScreen}
          options={({ navigation }) => ({
            title: 'Controles',
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
    </NavigationContainer>
  );
};

export default AppNavigator;
