import { executeQuery, getAllRows, getFirstRow } from './database';
import { generateId } from '../utils/helpers';

export const getRisks = async () => {
  try {
    const risks = getAllRows('SELECT * FROM risks ORDER BY created_at DESC');
    return risks || [];
  } catch (error) {
    console.error('Error getting risks:', error);
    return [];
  }
};

export const addRisk = async (risk) => {
  try {
    const id = generateId();
    executeQuery(
      `INSERT INTO risks (id, name, description, asset_id, threat, vulnerability, probability, impact, risk_level, treatment, status, owner) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, risk.name, risk.description || '', risk.assetId || null, risk.threat || '', 
       risk.vulnerability || '', risk.probability || '', risk.impact || '', 
       risk.riskLevel || '', risk.treatment || '', risk.status || 'Identificado', risk.owner || '']
    );
    
    const newRisk = getFirstRow('SELECT * FROM risks WHERE id = ?', [id]);
    return { success: true, risk: newRisk };
  } catch (error) {
    console.error('Error adding risk:', error);
    return { success: false, error: 'Error al agregar riesgo' };
  }
};

export const updateRisk = async (id, updatedData) => {
  try {
    executeQuery(
      `UPDATE risks SET 
       name = COALESCE(?, name),
       description = COALESCE(?, description),
       asset_id = COALESCE(?, asset_id),
       threat = COALESCE(?, threat),
       vulnerability = COALESCE(?, vulnerability),
       probability = COALESCE(?, probability),
       impact = COALESCE(?, impact),
       risk_level = COALESCE(?, risk_level),
       treatment = COALESCE(?, treatment),
       status = COALESCE(?, status),
       owner = COALESCE(?, owner),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updatedData.name, updatedData.description, updatedData.assetId, updatedData.threat,
       updatedData.vulnerability, updatedData.probability, updatedData.impact, 
       updatedData.riskLevel, updatedData.treatment, updatedData.status, updatedData.owner, id]
    );
    
    const updatedRisk = getFirstRow('SELECT * FROM risks WHERE id = ?', [id]);
    if (updatedRisk) {
      return { success: true, risk: updatedRisk };
    }
    return { success: false, error: 'Riesgo no encontrado' };
  } catch (error) {
    console.error('Error updating risk:', error);
    return { success: false, error: 'Error al actualizar riesgo' };
  }
};

export const deleteRisk = async (id) => {
  try {
    executeQuery('DELETE FROM risks WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting risk:', error);
    return { success: false, error: 'Error al eliminar riesgo' };
  }
};

export const getRisksByState = async (state) => {
  try {
    const risks = getAllRows('SELECT * FROM risks WHERE status = ?', [state]);
    return risks || [];
  } catch (error) {
    console.error('Error getting risks by state:', error);
    return [];
  }
};
