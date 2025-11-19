import STORAGE_KEYS, { saveData, getData } from './storage';
import { generateId } from '../utils/helpers';

export const getTeamMembers = async () => {
  try {
    const members = await getData(STORAGE_KEYS.TEAM);
    return members || [];
  } catch (error) {
    console.error('Error getting team members:', error);
    return [];
  }
};

export const addTeamMember = async (member) => {
  try {
    const members = await getTeamMembers();
    const newMember = {
      id: generateId(),
      ...member,
      createdAt: new Date().toISOString(),
    };
    members.push(newMember);
    await saveData(STORAGE_KEYS.TEAM, members);
    return { success: true, member: newMember };
  } catch (error) {
    return { success: false, error: 'Error al agregar miembro' };
  }
};

export const updateTeamMember = async (id, updatedData) => {
  try {
    const members = await getTeamMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updatedData, updatedAt: new Date().toISOString() };
      await saveData(STORAGE_KEYS.TEAM, members);
      return { success: true, member: members[index] };
    }
    return { success: false, error: 'Miembro no encontrado' };
  } catch (error) {
    return { success: false, error: 'Error al actualizar miembro' };
  }
};

export const deleteTeamMember = async (id) => {
  try {
    const members = await getTeamMembers();
    const filtered = members.filter(m => m.id !== id);
    await saveData(STORAGE_KEYS.TEAM, filtered);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar miembro' };
  }
};
