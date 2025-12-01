import React, { useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';

/**
 * Componente de contador animado para métricas del dashboard
 * Anima el cambio de valores numéricos con efecto count-up
 */
const AnimatedCounter = ({ value, duration = 800, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const textRef = useRef(null);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
  }, [value]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value: animValue }) => {
      if (textRef.current) {
        textRef.current.setNativeProps({
          text: Math.round(animValue).toString(),
        });
      }
    });

    return () => animatedValue.removeListener(listener);
  }, []);

  return (
    <Text ref={textRef} style={style}>
      {value}
    </Text>
  );
};

export default AnimatedCounter;
