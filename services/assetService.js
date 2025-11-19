import { executeQuery, getAllRows, getFirstRow } from './database';
import { generateId } from '../utils/helpers';

export const getAssets = async () => {
  try {
    const assets = getAllRows('SELECT * FROM assets ORDER BY created_at DESC');
    // Mapear 'type' a 'category' para compatibilidad con la UI
    return assets.map(asset => ({
      ...asset,
      category: asset.type
    }));
  } catch (error) {
    console.error('Error getting assets:', error);
    return [];
  }
};

export const addAsset = async (asset) => {
  try {
    const id = generateId();
    // Mapear 'category' a 'type' para la BD
    const type = asset.type || asset.category;
    
    if (!type) {
      return { success: false, error: 'La categoría/tipo es requerida' };
    }
    
    executeQuery(
      `INSERT INTO assets (id, name, type, description, owner, location, criticality, value) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, asset.name, type, asset.description || '', asset.owner || '', 
       asset.location || '', asset.criticality || '', asset.value || '']
    );
    
    const newAsset = getFirstRow('SELECT * FROM assets WHERE id = ?', [id]);
    // Mapear 'type' a 'category' para la UI
    return { success: true, asset: { ...newAsset, category: newAsset.type } };
  } catch (error) {
    console.error('Error adding asset:', error);
    return { success: false, error: 'Error al agregar activo' };
  }
};

export const updateAsset = async (id, updatedData) => {
  try {
    // Mapear 'category' a 'type' para la BD
    const type = updatedData.type || updatedData.category;
    
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
      [updatedData.name, type, updatedData.description, updatedData.owner,
       updatedData.location, updatedData.criticality, updatedData.value, id]
    );
    
    const updatedAsset = getFirstRow('SELECT * FROM assets WHERE id = ?', [id]);
    if (updatedAsset) {
      // Mapear 'type' a 'category' para la UI
      return { success: true, asset: { ...updatedAsset, category: updatedAsset.type } };
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
