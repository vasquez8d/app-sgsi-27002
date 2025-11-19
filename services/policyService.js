import { executeQuery, getAllRows, getFirstRow } from './database';
import { generateId } from '../utils/helpers';

export const getPolicies = async () => {
  try {
    const policies = getAllRows('SELECT * FROM policies ORDER BY created_at DESC');
    return policies || [];
  } catch (error) {
    console.error('Error getting policies:', error);
    return [];
  }
};

export const addPolicy = async (policy) => {
  try {
    const id = generateId();
    executeQuery(
      `INSERT INTO policies (id, code, title, description, content, version, status, responsible, approval_date, review_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, policy.code, policy.title, policy.description || '', policy.content || '', 
       '1.0', policy.status || 'Borrador', policy.responsible || '', 
       policy.approvalDate || null, policy.reviewDate || null]
    );
    
    const newPolicy = getFirstRow('SELECT * FROM policies WHERE id = ?', [id]);
    return { success: true, policy: newPolicy };
  } catch (error) {
    console.error('Error adding policy:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return { success: false, error: 'El código de política ya existe' };
    }
    return { success: false, error: 'Error al agregar política' };
  }
};

export const updatePolicy = async (id, updatedData) => {
  try {
    // Obtener versión actual e incrementarla
    const current = getFirstRow('SELECT version FROM policies WHERE id = ?', [id]);
    const currentVersion = current ? parseFloat(current.version) : 1.0;
    const newVersion = (currentVersion + 0.1).toFixed(1);
    
    executeQuery(
      `UPDATE policies SET 
       code = COALESCE(?, code),
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       content = COALESCE(?, content),
       version = ?,
       status = COALESCE(?, status),
       responsible = COALESCE(?, responsible),
       approval_date = COALESCE(?, approval_date),
       review_date = COALESCE(?, review_date),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updatedData.code, updatedData.title, updatedData.description, updatedData.content,
       newVersion, updatedData.status, updatedData.responsible, 
       updatedData.approvalDate, updatedData.reviewDate, id]
    );
    
    const updatedPolicy = getFirstRow('SELECT * FROM policies WHERE id = ?', [id]);
    if (updatedPolicy) {
      return { success: true, policy: updatedPolicy };
    }
    return { success: false, error: 'Política no encontrada' };
  } catch (error) {
    console.error('Error updating policy:', error);
    return { success: false, error: 'Error al actualizar política' };
  }
};

export const deletePolicy = async (id) => {
  try {
    executeQuery('DELETE FROM policies WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting policy:', error);
    return { success: false, error: 'Error al eliminar política' };
  }
};

export const getPoliciesByState = async (state) => {
  const policies = await getPolicies();
  return policies.filter(p => p.state === state);
};
