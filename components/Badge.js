import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

const Badge = ({ text, color, textColor, size = 'medium', style }) => {
  const badgeStyles = [
    styles.badge,
    styles[size],
    { backgroundColor: color || COLORS.primary },
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    { color: textColor || COLORS.white },
  ];

  return (
    <View style={badgeStyles}>
      <Text style={textStyles}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
  },
  large: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: FONT_SIZES.xs,
  },
  mediumText: {
    fontSize: FONT_SIZES.sm,
  },
  largeText: {
    fontSize: FONT_SIZES.md,
  },
});

export default Badge;
