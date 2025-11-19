import { executeQuery, getAllRows, getFirstRow } from './database';
import { generateId } from '../utils/helpers';

export const getTeamMembers = async () => {
  try {
    const members = getAllRows('SELECT * FROM team_members ORDER BY created_at DESC');
    return members || [];
  } catch (error) {
    console.error('Error getting team members:', error);
    return [];
  }
};

export const addTeamMember = async (member) => {
  try {
    const id = generateId();
    executeQuery(
      `INSERT INTO team_members (id, name, role, email, phone, department, responsibilities) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, member.name, member.role, member.email || '', member.phone || '', 
       member.department || '', member.responsibilities || '']
    );
    
    const newMember = getFirstRow('SELECT * FROM team_members WHERE id = ?', [id]);
    return { success: true, member: newMember };
  } catch (error) {
    console.error('Error adding team member:', error);
    return { success: false, error: 'Error al agregar miembro' };
  }
};

export const updateTeamMember = async (id, updatedData) => {
  try {
    executeQuery(
      `UPDATE team_members SET 
       name = COALESCE(?, name),
       role = COALESCE(?, role),
       email = COALESCE(?, email),
       phone = COALESCE(?, phone),
       department = COALESCE(?, department),
       responsibilities = COALESCE(?, responsibilities),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updatedData.name, updatedData.role, updatedData.email, updatedData.phone,
       updatedData.department, updatedData.responsibilities, id]
    );
    
    const updatedMember = getFirstRow('SELECT * FROM team_members WHERE id = ?', [id]);
    if (updatedMember) {
      return { success: true, member: updatedMember };
    }
    return { success: false, error: 'Miembro no encontrado' };
  } catch (error) {
    console.error('Error updating team member:', error);
    return { success: false, error: 'Error al actualizar miembro' };
  }
};

export const deleteTeamMember = async (id) => {
  try {
    executeQuery('DELETE FROM team_members WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting team member:', error);
    return { success: false, error: 'Error al eliminar miembro' };
  }
};
