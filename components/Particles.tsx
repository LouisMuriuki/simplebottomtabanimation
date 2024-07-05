import {LayoutChangeEvent, Pressable, StyleSheet, Text} from 'react-native';
import React, { useEffect, useRef } from 'react';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

type TabBarComponentProps = {
  active?: boolean;
  options: BottomTabNavigationOptions;
  onLayout: (e: LayoutChangeEvent) => void;
  onPress: () => void;
};

const TabBarParticlesComponent = ({
  active,
  options,
  onLayout,
  onPress,
}: TabBarComponentProps) => {
  // handle lottie animation -----------------------------------------
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref?.current) {
      // @ts-ignore
      ref.current.play();
    }
  }, [active]);
  // animations ------------------------------------------------------

  const animatedIconContainerStyles = useAnimatedStyle(() => {
    return {
    };
  });

  return (
    <Pressable onPress={onPress} onLayout={onLayout} style={styles.component}>
      <Animated.View
        style={[styles.iconContainer, animatedIconContainerStyles]}>
        {/* @ts-ignore */}
        {options?.tabBarIcon ? options.tabBarIcon({ref}) : <Text>?</Text>}
      </Animated.View>
    </Pressable>
  );
};

export default TabBarParticlesComponent;

const styles = StyleSheet.create({
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
