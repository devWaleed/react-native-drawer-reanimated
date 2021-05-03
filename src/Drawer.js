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

export default function Drawer(props) {
  const { width, height } = Dimensions.get('window');

  const drawerWidth = width * 0.8;

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const isOpen = useSharedValue(false);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = x.value;
      ctx.absoluteStartX = event.absoluteX;
    },
    onActive: (event, ctx) => {
      if (!isOpen.value) {
        if (ctx.absoluteStartX > 20) {
          return;
        }
      }

      isOpen.value =
        x.value == drawerWidth ? true : x.value == 0 ? false : true;

      var totalTranslation = ctx.startX + event.translationX;

      if (totalTranslation < drawerWidth) {
        x.value = totalTranslation;
      } else {
        x.value = drawerWidth;
      }
    },
    onEnd: (event, context) => {
      if (event.velocityX > 0) {
        if (event.velocityX > 1000) {
          x.value = withTiming(drawerWidth, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          isOpen.value = true;
          return;
        }

        if (x.value > drawerWidth * 0.4) {
          x.value = withTiming(drawerWidth, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
        } else {
          x.value = withTiming(0, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
        }
      } else {
        if (x.value < drawerWidth * 0.8) {
          x.value = withTiming(0, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
        } else {
          x.value = withTiming(drawerWidth, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
        }
      }
    },
  });

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: 100,
      backgroundColor: '#000',
      width: x.value > 0 ? '100%' : 0,
      height: x.value > 0 ? height : 0,
      position: 'absolute',
      opacity: interpolate(x.value, [0, drawerWidth], [0, 0.3]),
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
              x.value = withTiming(0);
            }}
          />
        </Animated.View>
        <Animated.View
          style={[
            drawerAnimatedStyle,
            {
              position: 'absolute',
              left: -290,
              top: 0,
              bottom: 0,
              height: height,
              width: drawerWidth,
              zIndex: 100,
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
};
