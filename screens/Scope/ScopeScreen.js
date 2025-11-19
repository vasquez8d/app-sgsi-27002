import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { getScope, updateScope } from '../../services/scopeService';

const ScopeScreen = ({ navigation }) => {
  const [scope, setScope] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    boundaries: '',
    justifications: '',
  });
  const [includedProcess, setIncludedProcess] = useState('');
  const [excludedProcess, setExcludedProcess] = useState('');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadScope();
  }, []);

  const loadScope = async () => {
    const data = await getScope();
    setScope(data);
    setFormData({
      description: data.description || '',
      boundaries: data.boundaries || '',
      justifications: data.justifications || '',
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateScope({
      ...scope,
      ...formData,
    });
    setLoading(false);

    if (result.success) {
      await loadScope();
      Alert.alert('Éxito', 'Alcance actualizado correctamente');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const addItem = (type, value) => {
    if (!value.trim()) return;

    const newScope = { ...scope };
    const key = type === 'included' ? 'includedProcesses' :
                type === 'excluded' ? 'excludedProcesses' :
                type === 'area' ? 'organizationalAreas' : 'locations';

    if (!newScope[key].includes(value.trim())) {
      newScope[key] = [...newScope[key], value.trim()];
      setScope(newScope);

      if (type === 'included') setIncludedProcess('');
      if (type === 'excluded') setExcludedProcess('');
      if (type === 'area') setArea('');
      if (type === 'location') setLocation('');
    }
  };

  const removeItem = (type, index) => {
    const newScope = { ...scope };
    const key = type === 'included' ? 'includedProcesses' :
                type === 'excluded' ? 'excludedProcesses' :
                type === 'area' ? 'organizationalAreas' : 'locations';

    newScope[key] = newScope[key].filter((_, i) => i !== index);
    setScope(newScope);
  };

  if (!scope) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Gestión del Alcance"
        subtitle="Definición del SGSI"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card title="Información General">
          <Input
            label="Descripción del Alcance"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Describa el alcance del SGSI..."
            multiline
            numberOfLines={4}
          />

          <Input
            label="Límites del SGSI"
            value={formData.boundaries}
            onChangeText={(text) => setFormData({ ...formData, boundaries: text })}
            placeholder="Defina los límites del sistema..."
            multiline
            numberOfLines={4}
          />

          <Input
            label="Justificaciones"
            value={formData.justifications}
            onChangeText={(text) => setFormData({ ...formData, justifications: text })}
            placeholder="Justifique las exclusiones o limitaciones..."
            multiline
            numberOfLines={4}
          />

          {scope.lastUpdated && (
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
              <Text style={styles.infoText}>
                Última actualización: {formatDateTime(scope.lastUpdated)}
              </Text>
            </View>
          )}
        </Card>

        <Card title="Procesos Incluidos" style={styles.card}>
          <View style={styles.addItemContainer}>
            <Input
              value={includedProcess}
              onChangeText={setIncludedProcess}
              placeholder="Nombre del proceso..."
              style={{ marginBottom: 0, flex: 1, marginRight: 8 }}
            />
            <Button
              title="Agregar"
              onPress={() => addItem('included', includedProcess)}
              size="medium"
            />
          </View>

          {scope.includedProcesses.length > 0 ? (
            <View style={styles.itemsList}>
              {scope.includedProcesses.map((process, index) => (
                <View key={index} style={styles.item}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={styles.itemText}>{process}</Text>
                  <Button
                    title=""
                    onPress={() => removeItem('included', index)}
                    variant="danger"
                    size="small"
                    icon={<Ionicons name="close" size={16} color={COLORS.white} />}
                    style={styles.removeButton}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No hay procesos incluidos</Text>
          )}
        </Card>

        <Card title="Procesos Excluidos" style={styles.card}>
          <View style={styles.addItemContainer}>
            <Input
              value={excludedProcess}
              onChangeText={setExcludedProcess}
              placeholder="Nombre del proceso..."
              style={{ marginBottom: 0, flex: 1, marginRight: 8 }}
            />
            <Button
              title="Agregar"
              onPress={() => addItem('excluded', excludedProcess)}
              size="medium"
            />
          </View>

          {scope.excludedProcesses.length > 0 ? (
            <View style={styles.itemsList}>
              {scope.excludedProcesses.map((process, index) => (
                <View key={index} style={styles.item}>
                  <Ionicons name="close-circle" size={20} color={COLORS.danger} />
                  <Text style={styles.itemText}>{process}</Text>
                  <Button
                    title=""
                    onPress={() => removeItem('excluded', index)}
                    variant="danger"
                    size="small"
                    icon={<Ionicons name="close" size={16} color={COLORS.white} />}
                    style={styles.removeButton}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No hay procesos excluidos</Text>
          )}
        </Card>

        <Card title="Áreas Organizacionales" style={styles.card}>
          <View style={styles.addItemContainer}>
            <Input
              value={area}
              onChangeText={setArea}
              placeholder="Nombre del área..."
              style={{ marginBottom: 0, flex: 1, marginRight: 8 }}
            />
            <Button
              title="Agregar"
              onPress={() => addItem('area', area)}
              size="medium"
            />
          </View>

          {scope.organizationalAreas.length > 0 ? (
            <View style={styles.itemsList}>
              {scope.organizationalAreas.map((orgArea, index) => (
                <View key={index} style={styles.item}>
                  <Ionicons name="business" size={20} color={COLORS.primary} />
                  <Text style={styles.itemText}>{orgArea}</Text>
                  <Button
                    title=""
                    onPress={() => removeItem('area', index)}
                    variant="danger"
                    size="small"
                    icon={<Ionicons name="close" size={16} color={COLORS.white} />}
                    style={styles.removeButton}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No hay áreas definidas</Text>
          )}
        </Card>

        <Card title="Ubicaciones Físicas" style={styles.card}>
          <View style={styles.addItemContainer}>
            <Input
              value={location}
              onChangeText={setLocation}
              placeholder="Dirección o ubicación..."
              style={{ marginBottom: 0, flex: 1, marginRight: 8 }}
            />
            <Button
              title="Agregar"
              onPress={() => addItem('location', location)}
              size="medium"
            />
          </View>

          {scope.locations.length > 0 ? (
            <View style={styles.itemsList}>
              {scope.locations.map((loc, index) => (
                <View key={index} style={styles.item}>
                  <Ionicons name="location" size={20} color={COLORS.warning} />
                  <Text style={styles.itemText}>{loc}</Text>
                  <Button
                    title=""
                    onPress={() => removeItem('location', index)}
                    variant="danger"
                    size="small"
                    icon={<Ionicons name="close" size={16} color={COLORS.white} />}
                    style={styles.removeButton}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No hay ubicaciones definidas</Text>
          )}
        </Card>

        <Button
          title="Guardar Cambios"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
          icon={<Ionicons name="save-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  card: {
    marginTop: SPACING.md,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  itemsList: {
    marginTop: SPACING.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
  itemText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  removeButton: {
    minHeight: 28,
    paddingHorizontal: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 6,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  saveButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
});

export default ScopeScreen;
