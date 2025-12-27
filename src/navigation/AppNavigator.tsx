import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { HomeworkListScreen } from '../screens/HomeworkListScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { HomeworkDetailScreen } from '../screens/HomeworkDetailScreen';
import { AISuggestionsScreen } from '../screens/AISuggestionsScreen';
import { Colors } from '../constants/colors';

export type RootStackParamList = {
  MainTabs: undefined;
  AddHomework: undefined;
  HomeworkDetail: { homeworkId: string };
};

export type TabParamList = {
  Home: undefined;
  HomeworkList: undefined;
  AISuggestions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="HomeworkList" 
        component={HomeworkListScreen}
        options={{ title: 'Tasks' }}
      />
      <Tab.Screen 
        name="AISuggestions" 
        component={AISuggestionsScreen}
        options={{ title: 'AI' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.card,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.text,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen 
          name="AddHomework" 
          component={AddTaskScreen}
          options={{ title: 'Create Task' }}
        />
        <Stack.Screen 
          name="HomeworkDetail" 
          component={HomeworkDetailScreen}
          options={{ title: 'Task Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

