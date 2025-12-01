import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCounter from './AnimatedCounter';

/**
 * Card de métrica del dashboard con animaciones y feedback visual
 */
const MetricCard = ({ 
  icon, 
  iconSize = 16,
  iconColor, 
  value, 
  label, 
  backgroundColor, 
  borderColor,
  valueColor,
  isActive = false,
  onPress,
  testID,
  accessibilityLabel,
  style
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <CardWrapper
        onPress={onPress}
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
        activeOpacity={0.7}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={onPress ? "button" : "none"}
        style={[
          styles.card,
          {
            backgroundColor,
            borderColor: isActive ? iconColor : borderColor,
            borderWidth: isActive ? 2 : 1,
          },
          isActive && styles.cardActive,
          style,
        ]}
      >
        <Ionicons name={icon} size={iconSize} color={iconColor} />
        <AnimatedCounter 
          value={value} 
          style={[styles.value, { color: valueColor || iconColor }]} 
        />
        <Text style={styles.label}>{label}</Text>
      </CardWrapper>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 8,
    minWidth: 70,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 6,
  },
  cardActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
    fontWeight: '600',
  },
});

export default MetricCard;
