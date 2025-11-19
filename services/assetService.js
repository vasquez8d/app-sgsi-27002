import { executeQuery, getAllRows, getFirstRow } from './database';
import { generateId } from '../utils/helpers';

export const getAssets = async () => {
  try {
    const assets = getAllRows('SELECT * FROM assets ORDER BY created_at DESC');
    return assets || [];
  } catch (error) {
    console.error('Error getting assets:', error);
    return [];
  }
};

export const addAsset = async (asset) => {
  try {
    const id = generateId();
    executeQuery(
      `INSERT INTO assets (id, name, type, description, owner, location, criticality, value) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, asset.name, asset.type, asset.description || '', asset.owner || '', 
       asset.location || '', asset.criticality || '', asset.value || '']
    );
    
    const newAsset = getFirstRow('SELECT * FROM assets WHERE id = ?', [id]);
    return { success: true, asset: newAsset };
  } catch (error) {
    console.error('Error adding asset:', error);
    return { success: false, error: 'Error al agregar activo' };
  }
};

export const updateAsset = async (id, updatedData) => {
  try {
    executeQuery(
      `UPDATE assets SET 
       name = COALESCE(?, name),
       type = COALESCE(?, type),
       description = COALESCE(?, description),
       owner = COALESCE(?, owner),
       location = COALESCE(?, location),
       criticality = COALESCE(?, criticality),
       value = COALESCE(?, value),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updatedData.name, updatedData.type, updatedData.description, updatedData.owner,
       updatedData.location, updatedData.criticality, updatedData.value, id]
    );
    
    const updatedAsset = getFirstRow('SELECT * FROM assets WHERE id = ?', [id]);
    if (updatedAsset) {
      return { success: true, asset: updatedAsset };
    }
    return { success: false, error: 'Activo no encontrado' };
  } catch (error) {
    console.error('Error updating asset:', error);
    return { success: false, error: 'Error al actualizar activo' };
  }
};

export const deleteAsset = async (id) => {
  try {
    executeQuery('DELETE FROM assets WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar activo' };
  }
};

export const getAssetsByCategory = async (category) => {
  const assets = await getAssets();
  return assets.filter(a => a.category === category);
};

export const getAssetsByCriticality = async (criticality) => {
  const assets = await getAssets();
  return assets.filter(a => a.criticality === criticality);
};
