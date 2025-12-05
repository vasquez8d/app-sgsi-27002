import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AnimatedCounter from './AnimatedCounter';
import { responsiveConfig } from '../utils/responsive';

/**
 * Card de métrica del dashboard con animaciones y feedback visual
 */
const MetricCard = ({ 
  icon, 
  iconLibrary = 'Ionicons',
  iconSize,
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
  style,
  width
}) => {
  const config = responsiveConfig.metricCard;
  const finalIconSize = iconSize || config.iconSize;
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
  
  // Seleccionar la biblioteca de íconos apropiada
  const IconComponent = iconLibrary === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;

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
            width: width || config.minWidth,
            padding: config.padding,
            borderRadius: config.borderRadius,
          },
          isActive && styles.cardActive,
          style,
        ]}
      >
        <IconComponent name={icon} size={finalIconSize} color={iconColor} />
        <AnimatedCounter 
          value={value} 
          style={[styles.value, { color: valueColor || iconColor }]} 
        />
        <Text style={styles.label}>{label}</Text>
      </CardWrapper>
    </Animated.View>
  );
};

const config = responsiveConfig.metricCard;

const styles = StyleSheet.create({
  card: {
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
    fontSize: config.fontSize,
    fontWeight: '700',
    marginTop: 2,
  },
  label: {
    fontSize: config.labelSize,
    color: '#6B7280',
    marginTop: 1,
    fontWeight: '600',
  },
});

export default MetricCard;
