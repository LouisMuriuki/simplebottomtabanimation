/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DefaultScreen from './screens/DefaultScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Path, Svg} from 'react-native-svg';

function App(): React.JSX.Element {
  const Tab = createBottomTabNavigator();
  const isDarkMode = useColorScheme() === 'dark';

  const AnimatedTabBar = ({
    state: {index: activeIndex, routes},
    navigation,
    descriptors,
  }: BottomTabBarProps) => {
    const {bottom} = useSafeAreaInsets();

    return (
      <View style={[styles.tabBar, {padding: bottom}]}>
        <Svg
          width={110}
          height={60}
          viewBox="0 0 110 60"
          style={[styles.activeBackground]}>
          <Path
            fill="#604AE6"
            d="M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.045 8.954-20 20-20H20z"
          />
        </Svg>

        <View>
          {routes.map((route:any,index:number                                                                                                                                              ))=>{
            return(
              <TabBarComponent key={index} onPress={navigation.navigate(route.name)}>
            )

          }}
        </View>
      </View>
    );
  };

  const TabBarComponent=()=>{

  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Tab.Navigator tabBar={props => <AnimatedTabBar {...props} />}>
          <Tab.Screen name="Home" component={DefaultScreen} />
          <Tab.Screen name="Chat" component={DefaultScreen} />
          <Tab.Screen name="Settings" component={DefaultScreen} />
          <Tab.Screen name="More" component={DefaultScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  activeBackground: {
    position: 'absolute',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  component: {
    height: 60,
    width: 60,
    marginTop: -5,
  },
  componentCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 36,
    width: 36,
  },
});

export default App;
