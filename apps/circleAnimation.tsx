import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {useReducer} from 'react';
import {
  LayoutChangeEvent,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Path, Svg} from 'react-native-svg';
import Animated, {
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import TabBarComponent from '../components/TabBarComponent';
import DefaultScreen from '../screens/DefaultScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function CircleAnimation(): React.JSX.Element {
  const Tab = createBottomTabNavigator();
  const isDarkMode = useColorScheme() === 'dark';

  const AnimatedTabBar = ({
    state: {index: activeIndex, routes},
    navigation,
    descriptors,
  }: BottomTabBarProps) => {
    const {bottom} = useSafeAreaInsets();
    const AnimatedSVG = Animated.createAnimatedComponent(Svg);

    // get information about the components position on the screen -----

    const reducer = (state: any, action: {x: number; index: number}) => {
      // Add the new value to the state
      const newState = [
        //checks to make sure no duplicate index properties
        ...state.filter((item: {index: number}) => item.index !== action.index),
        {x: action.x, index: action.index},
      ];
      return newState.sort((a, b) => a.index - b.index); // Sort to maintain order
    };

    const [layout, dispatch] = useReducer(reducer, []);
    console.log(layout);

    const handleLayout = (event: LayoutChangeEvent, index: number) => {
      // console.log("x is",event.nativeEvent.layout.x)
      dispatch({x: event.nativeEvent.layout.x, index});
    };

    const xOffset = useDerivedValue(() => {
      console.log(layout.length, routes.length, layout);
      // Our code hasn't finished rendering yet, so we can't use the layout values
      if (layout.length != routes.length) return 0;
      const currentLayout = [...layout];
      // Find the layout for the active index
      const activeLayout = currentLayout.find(
        ({index}) => index === activeIndex,
      );
      // Ensure the active layout exists before accessing its properties
      if (!activeLayout) return 0;
      // Subtract 25 to center the active background behind the TabBar components
      return activeLayout.x - 25;
    }, [activeIndex, layout]);

    const animatedStyles = useAnimatedStyle(() => ({
      transform: [{translateX: withTiming(xOffset.value, {duration: 250})}],
    }));

    return (
      <Animated.View
        style={[
          styles.tabBar,
          {padding: bottom},
        ]}>
        <AnimatedSVG
          width={110}
          height={60}
          color={'black'}
          viewBox="0 0 110 60"
          style={[styles.activeBackground, animatedStyles]}>
          <Path
            fill="purple"
            d="M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.045 8.954-20 20-20H20z"
          />
        </AnimatedSVG>

        <View style={styles.tabBarContainer}>
          {routes.map((route: any, index: number) => {
            const active = index === activeIndex;
            const {options} = descriptors[route.key];
            return (
              <TabBarComponent
                active={active}
                options={options}
                onLayout={e => handleLayout(e, index)}
                key={index}
                onPress={() => {
                  navigation.navigate(route.name);
                }}
              />
            );
          })}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Tab.Navigator tabBar={props => <AnimatedTabBar {...props} />}>
          <Tab.Screen
            name="Home"
            component={DefaultScreen}
            options={{
              tabBarIcon: ({}) => {
                return <Entypo name="home" size={24} color="purple" />;
              },
            }}
          />
          <Tab.Screen
            name="Chat"
            component={DefaultScreen}
            options={{
              tabBarIcon: ({}) => {
                return <Entypo name="chat" size={24} color="purple" />;
              },
            }}
          />
          <Tab.Screen
            name="Settings"
            component={DefaultScreen}
            options={{
              tabBarIcon: ({}) => {
                return <Ionicons name="settings" size={24} color="purple" />;
              },
            }}
          />
          <Tab.Screen
            name="More"
            component={DefaultScreen}
            options={{
              tabBarIcon: ({}) => {
                return (
                  <MaterialIcons name="more-horiz" size={24} color="purple" />
                );
              },
            }}
          />
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
});

export default CircleAnimation;
