import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import DashboardScreen from './screens/DashboardScreen';
import HistoryScreen from './screens/HistoryScreen';
import NewExpenseScreen from './screens/NewExpenseScreen';

import {TransactionProvider} from './TransactionContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TransactionProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if (route.name === 'Dashboard') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'History') {
                iconName = focused ? 'history' : 'history';
              } else if (route.name === 'New Record') {
                iconName = focused ? 'plus' : 'plus';
              }

              // You can return any component that you like here!
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#FFB6C1',
            tabBarInactiveTintColor: '#AEC6CF',
          })}>
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="New Record" component={NewExpenseScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </TransactionProvider>
  );
}
