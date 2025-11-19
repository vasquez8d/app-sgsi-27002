import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, SGSI_ROLES } from '../../utils/constants';
import { validateEmail, validatePhone } from '../../utils/helpers';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import CustomModal from '../../components/Modal';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../../services/teamService';

const TeamScreen = ({ navigation }) => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    role: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchQuery, members]);

  const loadMembers = async () => {
    const data = await getTeamMembers();
    setMembers(data);
  };

  const filterMembers = () => {
    if (!searchQuery) {
      setFilteredMembers(members);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = members.filter(
      member =>
        member.name.toLowerCase().includes(query) ||
        member.position.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
    );
    setFilteredMembers(filtered);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'El cargo es requerido';
    }

    if (!formData.role) {
      newErrors.role = 'El rol SGSI es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    let result;

    if (selectedMember) {
      result = await updateTeamMember(selectedMember.id, formData);
    } else {
      result = await addTeamMember(formData);
    }

    setLoading(false);

    if (result.success) {
      await loadMembers();
      closeModal();
      Alert.alert('Éxito', `Miembro ${selectedMember ? 'actualizado' : 'agregado'} correctamente`);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDelete = (member) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro de eliminar a ${member.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteTeamMember(member.id);
            if (result.success) {
              await loadMembers();
              Alert.alert('Éxito', 'Miembro eliminado correctamente');
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const openModal = (member = null) => {
    if (member) {
      setSelectedMember(member);
      setFormData({
        name: member.name,
        position: member.position,
        role: member.role,
        email: member.email,
        phone: member.phone || '',
      });
    } else {
      setSelectedMember(null);
      setFormData({
        name: '',
        position: '',
        role: '',
        email: '',
        phone: '',
      });
    }
    setErrors({});
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMember(null);
    setFormData({
      name: '',
      position: '',
      role: '',
      email: '',
      phone: '',
    });
    setErrors({});
  };

  const renderMember = ({ item }) => (
    <Card style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color={COLORS.white} />
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberPosition}>{item.position}</Text>
        </View>
      </View>

      <Badge text={item.role} color={COLORS.primary} style={styles.roleBadge} />

      <View style={styles.contactInfo}>
        <View style={styles.contactRow}>
          <Ionicons name="mail" size={16} color={COLORS.textLight} />
          <Text style={styles.contactText}>{item.email}</Text>
        </View>
        {item.phone && (
          <View style={styles.contactRow}>
            <Ionicons name="call" size={16} color={COLORS.textLight} />
            <Text style={styles.contactText}>{item.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openModal(item)}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Equipo de Proyecto"
        subtitle={`${members.length} miembros`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar miembros..."
        />

        {filteredMembers.length > 0 ? (
          <FlatList
            data={filteredMembers}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <EmptyState
            icon="people-outline"
            title="No hay miembros"
            message={searchQuery ? 'No se encontraron resultados' : 'Agregue el primer miembro del equipo SGSI'}
            action={
              !searchQuery && (
                <Button
                  title="Agregar Miembro"
                  onPress={() => openModal()}
                  icon={<Ionicons name="add" size={20} color={COLORS.white} style={{ marginRight: 8 }} />}
                />
              )
            }
          />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        title={selectedMember ? 'Editar Miembro' : 'Nuevo Miembro'}
        footer={
          <View style={styles.modalFooter}>
            <Button
              title="Cancelar"
              onPress={closeModal}
              variant="outline"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title={selectedMember ? 'Actualizar' : 'Guardar'}
              onPress={handleSave}
              loading={loading}
              style={{ flex: 1 }}
            />
          </View>
        }
      >
        <Input
          label="Nombre completo *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Ej: Juan Pérez"
          error={errors.name}
        />

        <Input
          label="Cargo *"
          value={formData.position}
          onChangeText={(text) => setFormData({ ...formData, position: text })}
          placeholder="Ej: Gerente de TI"
          error={errors.position}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rol SGSI *</Text>
          <ScrollView style={styles.rolesList} nestedScrollEnabled>
            {SGSI_ROLES.map((role, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.roleOption,
                  formData.role === role && styles.roleOptionSelected,
                ]}
                onPress={() => setFormData({ ...formData, role })}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    formData.role === role && styles.roleOptionTextSelected,
                  ]}
                >
                  {role}
                </Text>
                {formData.role === role && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
        </View>

        <Input
          label="Email *"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          label="Teléfono"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="+56912345678"
          keyboardType="phone-pad"
          error={errors.phone}
        />
      </CustomModal>
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
  listContent: {
    paddingBottom: 80,
  },
  memberCard: {
    marginBottom: SPACING.md,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  memberPosition: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  roleBadge: {
    marginBottom: SPACING.sm,
  },
  contactInfo: {
    marginBottom: SPACING.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs / 2,
  },
  contactText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginHorizontal: SPACING.xs / 2,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginLeft: SPACING.xs / 2,
  },
  fab: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalFooter: {
    flexDirection: 'row',
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  rolesList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  roleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roleOptionSelected: {
    backgroundColor: COLORS.background,
  },
  roleOptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  roleOptionTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs / 2,
  },
});

export default TeamScreen;
