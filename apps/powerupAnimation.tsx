import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import React, {useReducer} from 'react';
import TabBarComponent from '../components/TabBarComponent';
import {NavigationContainer} from '@react-navigation/native';
import DefaultScreen from '../screens/DefaultScreen';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const powerupAnimation = () => {
  const Tab = createBottomTabNavigator();
  const isDarkMode = useColorScheme() === 'dark';

  const AnimatedTabBar = ({
    state: {index: activeIndex, routes},
    navigation,
    descriptors,
  }: BottomTabBarProps) => {
    const {bottom} = useSafeAreaInsets();
    const reducer = (state: any, action: {x: number; index: number}) => {
      const newState = [
        ...state.filter((item: {index: number}) => item.index != action.index, {
          x: action.x,
          index: action.index,
        }),
      ];
      return newState.sort((a, b) => a.index - b.index);
    };

    const [layout, dispatch] = useReducer(reducer, []);

    const handleLayout = (e: LayoutChangeEvent, index: number) => {
      dispatch({x: e.nativeEvent.layout.x, index});
    };
    return (
      <View style={[styles.tabBar, {padding: bottom}]}>
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
};

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

export default powerupAnimation;
