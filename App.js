import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
} from 'react-native';

import { createStore, combineReducers, applyMiddleware } from 'redux'
import {
  ActionSheet,
  Root,
  Icon
} from 'native-base'

import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import profile from './store/reducers/profile'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import HomeScreen from './screens/HomeScreen'
import FollowingsScreen from './screens/FollowingsScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import SingleMapScreen from './screens/RankScreens/SingleMapScreen'
import TeamMapScreen from './screens/RankScreens/TeamMapScreen'
import UnrankedScreen from './screens/RankScreens/UnrankedScreen'
import PlayerScreen from './screens/PlayerScreen'
import ProfileScreen from './screens/ProfileScreen'
import MatchHistoryScreen from './screens/MatchHistoryScreen'
import MatchDetailScreen from './screens/MatchDetailScreen'
import PlayerDetailScreen from './screens/PlayerDetailScreen'
import { auth } from './services/firebase'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Colors from './constants/Colors'
import { logout } from './services/firebase'
import DialogInput from 'react-native-dialog-input'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import AoeNameInputScreen from './screens/AoeNameInputScreen';

const rootReducer = combineReducers({
  profile: profile
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk))
//const AoeNameStack = createStackNavigator()
const LoginStack = createStackNavigator()
const HomeStack = createStackNavigator()
const LeaderboardStack = createStackNavigator()
const FollowingsStack = createStackNavigator()
const ProfileStack = createStackNavigator()
const PlayerStack = createStackNavigator()
const Tab = createBottomTabNavigator()

const App = () => {

  const [authenticated, setAuthenticated] = useState(false)
  const [isSettingName, setIsSettingName] = useState(false)

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        if (user.displayName) {
          setAuthenticated(true)
          setIsSettingName(false)
        }
        else {
          setIsSettingName(true)
          setAuthenticated(true)
        }
      }
      else {
        setAuthenticated(false)
      }
    })
  }, [auth])

  const tabIcon = (name, focused, size, color) => {
    let iconName = ''
    switch (name) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline'
        return <Ionicons name={iconName} size={size} color={color} />
      case 'Profile':
        iconName = focused ? 'account' : 'account-outline'
        return <Ionicons name={iconName} size={size} color={color} />
      case 'Followings':
        iconName = focused ? 'heart' : 'heart-outline'
        return <Ionicons name={iconName} size={size} color={color} />
      case 'Leaderboard':
        iconName = focused ? 'magnify' : 'magnify'
        return <Ionicons name={iconName} size={size} color={color} />
      default:
        return console.log('Error')
    }
  }

  const HomeStackScreen = () => {
    return (
      <Root>
        <HomeStack.Navigator>
          <HomeStack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Age of Empire 2'
            }}
          />
          <HomeStack.Screen name="PlayerScreen" component={PlayerScreen} options={{
            title: 'Player Detail'
          }} />
          <HomeStack.Screen name="MatchDetail" component={MatchDetailScreen} options={{
            title: 'Match Detail'
          }} />
          <HomeStack.Screen name="PlayerDetailScreen" component={PlayerDetailScreen} options={{
            title: 'Match Detail'
          }} />
        </HomeStack.Navigator>
      </Root>
    )
  }

  const FollowingsStackScreen = () => {
    return (
      <FollowingsStack.Navigator>
        <FollowingsStack.Screen name="Followings" component={FollowingsScreen} options={{
        }} />
        <FollowingsStack.Screen name="PlayerScreen" component={PlayerScreen} options={{
          title: 'Player Details'
        }} />
        <FollowingsStack.Screen name="MatchDetail" component={MatchDetailScreen} options={{
          title: 'Match Detail'
        }} />
        <FollowingsStack.Screen name="PlayerDetailScreen" component={PlayerDetailScreen} options={{
          title: 'Match Detail'
        }} />
      </FollowingsStack.Navigator>
    )
  }

  const LeaderboardStackScreen = () => {
    return (
      <LeaderboardStack.Navigator>
        <LeaderboardStack.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{
            title: 'Search'
          }}
        />
        <LeaderboardStack.Screen name="PlayerScreen" component={PlayerScreen} options={{
          title: 'Player Details'
        }} />
        <LeaderboardStack.Screen name="MatchDetail" component={MatchDetailScreen} options={{
          title: 'Match Detail'
        }} />
        <LeaderboardStack.Screen name="PlayerDetailScreen" component={PlayerDetailScreen} options={{
          title: 'Match Detail'
        }} />

      </LeaderboardStack.Navigator>
    )
  }

  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name="Profile"
          component={ProfileScreen}
        // options={{
        //   title: auth().currentUser.displayName
        // }}
        />
        <ProfileStack.Screen name="SingleMap" component={SingleMapScreen} options={{
          title: '1v1 Random Map'
        }} />
        <ProfileStack.Screen name="TeamMap" component={TeamMapScreen} options={{
          title: 'Team Random Map'
        }} />
        <ProfileStack.Screen name="Unranked" component={UnrankedScreen} options={{
          title: 'Unranked Games'
        }} />
        <ProfileStack.Screen name="MatchHistory" component={MatchHistoryScreen} options={{
          title: 'Match History'
        }} />
        <ProfileStack.Screen name="MatchDetail" component={MatchDetailScreen} options={{
          title: 'Match Detail'
        }} />
        <ProfileStack.Screen name="PlayerScreen" component={PlayerScreen} options={{
          title: 'Player Detail'
        }} />
        <ProfileStack.Screen name="PlayerDetailScreen" component={PlayerDetailScreen} options={{
          title: 'Match Detail'
        }} />
      </ProfileStack.Navigator>
    )
  }

  const AuthenticatedNavigator = () => {
    return <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const icon = tabIcon(route.name, focused, 30, color)
            return icon
          },
        })}
        tabBarOptions={{
          showLabel: false,
          activeTintColor: Colors.primary,
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Followings" component={FollowingsStackScreen} />
        <Tab.Screen name="Leaderboard" component={LeaderboardStackScreen} />
        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  }

  const UnAuthenticatedNavigator = () => {
    return <NavigationContainer>
      <LoginStack.Navigator
        initialRouteName="Login"
        screenOptions={{
          title: 'Age of Empire 2',
          headerLeft: null
        }}>
        <LoginStack.Screen name="Login" component={LoginScreen} />
        <LoginStack.Screen name="Signup" component={SignupScreen} />
      </LoginStack.Navigator>
    </NavigationContainer>
  }

  return (
    <Provider store={store}>
      {/* <DialogInput isDialogVisible={dialogVisible}
        //title={"Change Name"}
        modalStyle={{ backgroundColor: '#0000004a' }}
        message={"Enter AoE Name"}
        hintInput={null}
        submitInput={(inputText) => { changeNameHandler(inputText) }}
        closeDialog={() => setDialogVisible(false)}>
      </DialogInput> */}
      {authenticated
        ? isSettingName
          ? <AoeNameInputScreen />
          : <AuthenticatedNavigator />
        : <UnAuthenticatedNavigator />}
    </Provider >
  );
}

// const styles = StyleSheet.create({
//   modalContainer: {
//     alignItems: 'center',
//     //backgroundColor: '#00000036',
//   },
//   modal: {
//     shadowRadius: 8,
//     width: '70%',
//     backgroundColor: 'white',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// })

export default App
