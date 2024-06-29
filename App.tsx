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
import TabBarComponent from './components/TabBarComponent';
import DefaultScreen from './screens/DefaultScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Path, Svg} from 'react-native-svg';
import Animated, {
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

function App(): React.JSX.Element {
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
      return [...state, {x: action.x, index: action.index}];
    };

    const [layout, dispatch] = useReducer(reducer, []);
    console.log(layout);

    const handleLayout = (event: LayoutChangeEvent, index: number) => {
      dispatch({x: event.nativeEvent.layout.x, index});
    };

    const xOffset = useDerivedValue(() => {
      // Our code hasn't finished rendering yet, so we can't use the layout values
      if (layout.length !== routes.length) return 0;
      // We can use the layout values
      // Copy layout to avoid errors between different threads
      // We subtract 25 so the active background is centered behind our TabBar Components
      // 20 pixels is the width of the left part of the svg (the quarter circle outwards)
      // 5 pixels come from the little gap between the active background and the circle of the TabBar Components
      return [...layout].find(({index}) => index === activeIndex)!.x - 25;
      // Calculate the offset new if the activeIndex changes (e.g. when a new tab is selected)
      // or the layout changes (e.g. when the components haven't finished rendering yet)
    }, [activeIndex, layout]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        // translateX to the calculated offset with a smooth transition
        transform: [{translateX: withTiming(xOffset.value, {duration: 250})}],
      };
    });

    return (
      <View style={[styles.tabBar, {padding: bottom}]}>
        <AnimatedSVG
          width={110}
          height={60}
          viewBox="0 0 110 60"
          style={[styles.activeBackground, animatedStyles]}>
          <Path
            fill="#604AE6"
            d="M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.045 8.954-20 20-20H20z"
          />
        </AnimatedSVG>

        <View style={styles.tabBarContainer}>
          {routes.map((route: any, index: number) => {
            const active = index === activeIndex;
            const { options } = descriptors[route.key]
            return (
              <TabBarComponent
                active={active}
                options={options}
                onLayout={e => handleLayout(e, index)}
                key={index}
                onPress={() => navigation.navigate(route.name)}
              />
            );
          })}
        </View>
      </View>
    );
  };

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
});

export default App;
