import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALCANCE_THEME } from '../utils/alcanceConstants';

/**
 * Barra de búsqueda mejorada con debounce y botón clear
 */
const SearchBarEnhanced = ({ 
  value, 
  onChangeText, 
  placeholder = 'Buscar...', 
  debounceMs = 300,
  testID,
  accessibilityLabel 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = React.useRef(null);

  const handleTextChange = useCallback((text) => {
    setLocalValue(text);
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      onChangeText(text);
    }, debounceMs);
  }, [onChangeText, debounceMs]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChangeText('');
  }, [onChangeText]);

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color={ALCANCE_THEME.colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={ALCANCE_THEME.colors.textSecondary}
        value={localValue}
        onChangeText={handleTextChange}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="search"
      />
      {localValue.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID={`${testID}-clear`}
          accessibilityLabel="Limpiar búsqueda"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={20} color={ALCANCE_THEME.colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: ALCANCE_THEME.colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
});

export default SearchBarEnhanced;
