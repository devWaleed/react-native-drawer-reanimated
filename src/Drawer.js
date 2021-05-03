import React from 'react';
import { Dimensions } from 'react-native';
import {
  PanGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Drawer(props) {
  const drawerWidth = props.width;
  const translationX = useSharedValue(0);
  const isOpen = useSharedValue(false);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      if (!props.enabled) return;

      ctx.startX = translationX.value;
      ctx.absoluteStartX = event.absoluteX;
    },
    onActive: (event, ctx) => {
      if (!props.enabled) return;

      if (!isOpen.value) {
        if (ctx.absoluteStartX > props.dragStartThreshold) {
          return;
        }
      }

      isOpen.value =
        translationX.value == drawerWidth
          ? true
          : translationX.value == 0
          ? false
          : true;

      var totalTranslation = ctx.startX + event.translationX;

      if (totalTranslation < drawerWidth) {
        translationX.value = totalTranslation;
      } else {
        translationX.value = drawerWidth;
      }
    },
    onEnd: (event, context) => {
      if (!props.enabled) return;

      const timingOptions = {
        easing: Easing.bezier(0.69, 0.69, 0.69, 0.69),
        duration: 150,
      };

      if (event.velocityX > 0) {
        if (event.velocityX > 1000) {
          translationX.value = withTiming(drawerWidth, timingOptions);
          isOpen.value = true;
          return;
        }

        if (translationX.value > drawerWidth * props.minimumOpenThreshold) {
          translationX.value = withTiming(drawerWidth, timingOptions);
        } else {
          translationX.value = withTiming(0, timingOptions);
        }
      } else {
        if (translationX.value < drawerWidth * props.minimumCloseThreshold) {
          translationX.value = withTiming(0, timingOptions);
        } else {
          translationX.value = withTiming(drawerWidth, timingOptions);
        }
      }
    },
  });

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: 100,
      backgroundColor: props.overlayBackgroundColor,
      width: translationX.value > 0 ? '100%' : 0,
      height: translationX.value > 0 ? screenHeight : 0,
      position: 'absolute',
      opacity: interpolate(
        translationX.value,
        [0, drawerWidth],
        [0, props.overlayMaxOpacity],
      ),
    };
  });

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      activeOffsetX={[-10, 10]}>
      <Animated.View>
        <Animated.View style={[overlayAnimatedStyle]}>
          <TouchableOpacity
            style={{ width: '100%', height: '100%' }}
            onPress={() => {
              translationX.value = withTiming(0);
            }}
          />
        </Animated.View>
        <Animated.View
          style={[
            drawerAnimatedStyle,
            {
              position: 'absolute',
              left: -drawerWidth,
              top: 0,
              bottom: 0,
              height: screenHeight,
              width: drawerWidth,
              zIndex: 101,
            },
          ]}>
          {props.content()}
        </Animated.View>
        {props.children}
      </Animated.View>
    </PanGestureHandler>
  );
}

Drawer.defaultProps = {
  content: () => {},
  width: screenWidth * 0.8,
  dragStartThreshold: 20,
  minimumOpenThreshold: 0.4,
  minimumCloseThreshold: 0.8,
  overlayBackgroundColor: '#000',
  overlayMaxOpacity: 0.5,
  enabled: true,
};
