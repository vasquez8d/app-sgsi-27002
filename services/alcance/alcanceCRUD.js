import { executeQuery, getAllRows, getFirstRow } from '../database';
import { generateId } from '../../utils/helpers';
import logger from '../../utils/logger';

// ═══════════════════════════════════════════════════════════════
// CRUD DE PROCESOS
// ═══════════════════════════════════════════════════════════════

export const addProceso = (proceso) => {
  try {
    logger.performanceStart('addProceso');
    const id = generateId();
    executeQuery(
      `INSERT INTO alcance_procesos 
       (id, macroproceso, nombre_proceso, responsable_area, descripcion, estado, criticidad, fecha_inclusion, procesos_relacionados, justificacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        proceso.macroproceso,
        proceso.nombreProceso,
        proceso.responsableArea || '',
        proceso.descripcion || '',
        proceso.estado || 'En Evaluación',
        proceso.criticidad || 'Media',
        proceso.fechaInclusion || new Date().toISOString(),
        JSON.stringify(proceso.procesosRelacionados || []),
        proceso.justificacion || '',
      ]
    );
    logger.performanceEnd('addProceso');
    logger.crudCreate('AlcanceCRUD', 'Proceso', id, { nombreProceso: proceso.nombreProceso, macroproceso: proceso.macroproceso });
    return { success: true, id };
  } catch (error) {
    logger.error('AlcanceCRUD', 'Error agregando proceso', error);
    return { success: false, error: error.message };
  }
};

export const updateProceso = (id, proceso) => {
  try {
    logger.performanceStart('updateProceso');
    executeQuery(
      `UPDATE alcance_procesos SET 
       macroproceso = ?, nombre_proceso = ?, responsable_area = ?, descripcion = ?,
       estado = ?, criticidad = ?, fecha_inclusion = ?, procesos_relacionados = ?, justificacion = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        proceso.macroproceso,
        proceso.nombreProceso,
        proceso.responsableArea || '',
        proceso.descripcion || '',
        proceso.estado,
        proceso.criticidad,
        proceso.fechaInclusion,
        JSON.stringify(proceso.procesosRelacionados || []),
        proceso.justificacion || '',
        id,
      ]
    );
    logger.performanceEnd('updateProceso');
    logger.crudUpdate('AlcanceCRUD', 'Proceso', id, { nombreProceso: proceso.nombreProceso });
    return { success: true };
  } catch (error) {
    logger.error('AlcanceCRUD', 'Error actualizando proceso', error);
    return { success: false, error: error.message };
  }
};

export const deleteProceso = (id) => {
  try {
    executeQuery('DELETE FROM alcance_procesos WHERE id = ?', [id]);
    logger.crudDelete('AlcanceCRUD', 'Proceso', id);
    return { success: true };
  } catch (error) {
    logger.error('AlcanceCRUD', 'Error eliminando proceso', error);
    return { success: false, error: error.message };
  }
};

export const getProcesos = () => {
  try {
    logger.performanceStart('getProcesos');
    const procesos = getAllRows('SELECT * FROM alcance_procesos ORDER BY created_at DESC');
    return (procesos || []).map(p => ({
      id: p.id,
      macroproceso: p.macroproceso,
      nombreProceso: p.nombre_proceso,
      responsableArea: p.responsable_area,
      descripcion: p.descripcion,
      estado: p.estado,
      criticidad: p.criticidad,
      fechaInclusion: p.fecha_inclusion,
      procesosRelacionados: p.procesos_relacionados ? JSON.parse(p.procesos_relacionados) : [],
    }));
    logger.performanceEnd('getProcesos');
    logger.crudList('AlcanceCRUD', 'Procesos', procesos?.length || 0);
  } catch (error) {
    logger.error('AlcanceCRUD', 'Error obteniendo procesos', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// CRUD DE UNIDADES
// ═══════════════════════════════════════════════════════════════

export const addUnidad = (unidad) => {
  try {
    const id = generateId();
    executeQuery(
      `INSERT INTO alcance_unidades 
       (id, nombre_unidad, tipo, nivel_jerarquico, responsable, rol_sgsi, procesos_asociados, incluida, justificacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        unidad.nombreUnidad,
        unidad.tipo,
        unidad.nivelJerarquico || 1,
        unidad.responsable || '',
        unidad.rolSGSI || 'Coparticipe',
        JSON.stringify(unidad.procesosAsociados || []),
        unidad.incluida ? 1 : 0,
        unidad.justificacion || '',
      ]
    );
    return { success: true, id };
  } catch (error) {
    console.error('Error agregando unidad:', error);
    return { success: false, error: error.message };
  }
};

export const updateUnidad = (id, unidad) => {
  try {
    executeQuery(
      `UPDATE alcance_unidades SET 
       nombre_unidad = ?, tipo = ?, nivel_jerarquico = ?, responsable = ?,
       rol_sgsi = ?, procesos_asociados = ?, incluida = ?, justificacion = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        unidad.nombreUnidad,
        unidad.tipo,
        unidad.nivelJerarquico,
        unidad.responsable || '',
        unidad.rolSGSI,
        JSON.stringify(unidad.procesosAsociados || []),
        unidad.incluida ? 1 : 0,
        unidad.justificacion || '',
        id,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error('Error actualizando unidad:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUnidad = (id) => {
  try {
    executeQuery('DELETE FROM alcance_unidades WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando unidad:', error);
    return { success: false, error: error.message };
  }
};

export const deleteAllUnidades = () => {
  try {
    executeQuery('DELETE FROM alcance_unidades');
    const result = getFirstRow('SELECT COUNT(*) as count FROM alcance_unidades');
    console.log(`🗑️ Todas las unidades eliminadas. Total restante: ${result?.count || 0}`);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando todas las unidades:', error);
    return { success: false, error: error.message };
  }
};

export const getUnidades = () => {
  try {
    const rows = getAllRows('SELECT * FROM alcance_unidades ORDER BY created_at DESC') || [];
    const mapped = rows.map(u => ({
      id: u.id,
      nombreUnidad: u.nombre_unidad,
      tipo: u.tipo,
      nivelJerarquico: u.nivel_jerarquico,
      responsable: u.responsable,
      rolSGSI: u.rol_sgsi,
      procesosAsociados: u.procesos_asociados ? JSON.parse(u.procesos_asociados) : [],
      incluida: Boolean(u.incluida),
      justificacion: u.justificacion,
    }));
    return mapped;
  } catch (error) {
    console.error('Error obteniendo unidades:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// CRUD DE UBICACIONES
// ═══════════════════════════════════════════════════════════════

export const addUbicacion = (ubicacion) => {
  try {
    const id = generateId();
    executeQuery(
      `INSERT INTO alcance_ubicaciones 
       (id, nombre_sitio, direccion, tipo, tipos_activo, activos_presentes, responsable_sitio, incluido, latitud, longitud, observaciones, justificacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        ubicacion.nombreSitio,
        ubicacion.direccion || '',
        ubicacion.tipo,
        JSON.stringify(ubicacion.tiposActivo || []),
        JSON.stringify(ubicacion.activosPresentes || []),
        ubicacion.responsableSitio || '',
        ubicacion.incluido ? 1 : 0,
        ubicacion.coordenadas?.lat || null,
        ubicacion.coordenadas?.lng || null,
        ubicacion.observaciones || '',
        ubicacion.justificacion || '',
      ]
    );
    return { success: true, id };
  } catch (error) {
    console.error('Error agregando ubicación:', error);
    return { success: false, error: error.message };
  }
};

export const updateUbicacion = (id, ubicacion) => {
  try {
    executeQuery(
      `UPDATE alcance_ubicaciones SET 
       nombre_sitio = ?, direccion = ?, tipo = ?, tipos_activo = ?, activos_presentes = ?,
       responsable_sitio = ?, incluido = ?, latitud = ?, longitud = ?, observaciones = ?, justificacion = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        ubicacion.nombreSitio,
        ubicacion.direccion || '',
        ubicacion.tipo,
        JSON.stringify(ubicacion.tiposActivo || []),
        JSON.stringify(ubicacion.activosPresentes || []),
        ubicacion.responsableSitio || '',
        ubicacion.incluido ? 1 : 0,
        ubicacion.coordenadas?.lat || null,
        ubicacion.coordenadas?.lng || null,
        ubicacion.observaciones || '',
        ubicacion.justificacion || '',
        id,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error('Error actualizando ubicación:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUbicacion = (id) => {
  try {
    executeQuery('DELETE FROM alcance_ubicaciones WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando ubicación:', error);
    return { success: false, error: error.message };
  }
};

export const getUbicaciones = () => {
  try {
    const rows = getAllRows('SELECT * FROM alcance_ubicaciones ORDER BY created_at DESC') || [];
    return rows.map(ub => ({
      id: ub.id,
      nombreSitio: ub.nombre_sitio,
      direccion: ub.direccion,
      tipo: ub.tipo,
      tiposActivo: ub.tipos_activo ? JSON.parse(ub.tipos_activo) : [],
      activosPresentes: ub.activos_presentes ? JSON.parse(ub.activos_presentes) : [],
      responsableSitio: ub.responsable_sitio,
      incluido: Boolean(ub.incluido),
      coordenadas: ub.latitud && ub.longitud ? { lat: ub.latitud, lng: ub.longitud } : null,
      observaciones: ub.observaciones,
    }));
  } catch (error) {
    console.error('Error obteniendo ubicaciones:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// CRUD DE INFRAESTRUCTURA
// ═══════════════════════════════════════════════════════════════

export const addInfraestructura = (infra) => {
  try {
    const id = generateId();
    executeQuery(
      `INSERT INTO alcance_infraestructura 
       (id, identificador, tipo_activo, sitio, unidad_negocio, ubicacion_fisica, propietario, 
        sistema_operativo, funcion, criticidad, estado_activo, incluido, observaciones, justificacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        infra.identificador,
        infra.tipoActivo || '',
        infra.sitio || '',
        infra.unidadNegocio || '',
        infra.ubicacionFisica || '',
        infra.propietario || '',
        infra.sistemaOperativo || '',
        infra.funcion || '',
        infra.criticidad || 'Media',
        infra.estadoActivo || 'Activo',
        infra.incluido ? 1 : 0,
        infra.observaciones || '',
        infra.justificacion || '',
      ]
    );
    return { success: true, id };
  } catch (error) {
    console.error('Error agregando infraestructura:', error);
    return { success: false, error: error.message };
  }
};

export const updateInfraestructura = (id, infra) => {
  try {
    executeQuery(
      `UPDATE alcance_infraestructura SET 
       identificador = ?, tipo_activo = ?, sitio = ?, unidad_negocio = ?, ubicacion_fisica = ?,
       propietario = ?, sistema_operativo = ?, funcion = ?, criticidad = ?, estado_activo = ?, 
       incluido = ?, observaciones = ?, justificacion = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        infra.identificador,
        infra.tipoActivo || '',
        infra.sitio || '',
        infra.unidadNegocio || '',
        infra.ubicacionFisica || '',
        infra.propietario || '',
        infra.sistemaOperativo || '',
        infra.funcion || '',
        infra.criticidad,
        infra.estadoActivo,
        infra.incluido ? 1 : 0,
        infra.observaciones || '',
        id,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error('Error actualizando infraestructura:', error);
    return { success: false, error: error.message };
  }
};

export const deleteInfraestructura = (id) => {
  try {
    executeQuery('DELETE FROM alcance_infraestructura WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando infraestructura:', error);
    return { success: false, error: error.message };
  }
};

export const getInfraestructura = () => {
  try {
    const rows = getAllRows('SELECT * FROM alcance_infraestructura ORDER BY created_at DESC') || [];
    return rows.map(i => ({
      id: i.id,
      identificador: i.identificador,
      tipoActivo: i.tipo_activo || '',
      sitio: i.sitio,
      unidadNegocio: i.unidad_negocio,
      ubicacionFisica: i.ubicacion_fisica,
      propietario: i.propietario,
      sistemaOperativo: i.sistema_operativo,
      funcion: i.funcion,
      criticidad: i.criticidad,
      estadoActivo: i.estado_activo,
      incluido: Boolean(i.incluido),
      observaciones: i.observaciones,
    }));
  } catch (error) {
    console.error('Error obteniendo infraestructura:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// CRUD DE EXCLUSIONES
// ═══════════════════════════════════════════════════════════════

export const addExclusion = (exclusion) => {
  try {
    const id = generateId();
    executeQuery(
      `INSERT INTO alcance_exclusiones 
       (id, elemento_excluido, categoria, justificacion, responsable_decision, fecha_exclusion, revision_pendiente, proxima_revision)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        exclusion.elementoExcluido,
        exclusion.categoria,
        exclusion.justificacion,
        exclusion.responsableDecision || '',
        exclusion.fechaExclusion || new Date().toISOString(),
        exclusion.revisionPendiente ? 1 : 0,
        exclusion.proximaRevision || null,
      ]
    );
    return { success: true, id };
  } catch (error) {
    console.error('Error agregando exclusión:', error);
    return { success: false, error: error.message };
  }
};

export const updateExclusion = (id, exclusion) => {
  try {
    executeQuery(
      `UPDATE alcance_exclusiones SET 
       elemento_excluido = ?, categoria = ?, justificacion = ?, responsable_decision = ?,
       fecha_exclusion = ?, revision_pendiente = ?, proxima_revision = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        exclusion.elementoExcluido,
        exclusion.categoria,
        exclusion.justificacion,
        exclusion.responsableDecision || '',
        exclusion.fechaExclusion,
        exclusion.revisionPendiente ? 1 : 0,
        exclusion.proximaRevision || null,
        id,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error('Error actualizando exclusión:', error);
    return { success: false, error: error.message };
  }
};

export const deleteExclusion = (id) => {
  try {
    executeQuery('DELETE FROM alcance_exclusiones WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando exclusión:', error);
    return { success: false, error: error.message };
  }
};

export const getExclusiones = () => {
  try {
    const rows = getAllRows('SELECT * FROM alcance_exclusiones ORDER BY created_at DESC') || [];
    return rows.map(e => ({
      id: e.id,
      elementoExcluido: e.elemento_excluido,
      categoria: e.categoria,
      justificacion: e.justificacion,
      responsableDecision: e.responsable_decision,
      fechaExclusion: e.fecha_exclusion,
      revisionPendiente: Boolean(e.revision_pendiente),
      proximaRevision: e.proxima_revision,
    }));
  } catch (error) {
    console.error('Error obteniendo exclusiones:', error);
    return [];
  }
};

export default {
  addProceso,
  updateProceso,
  deleteProceso,
  getProcesos,
  addUnidad,
  updateUnidad,
  deleteUnidad,
  deleteAllUnidades,
  getUnidades,
  addUbicacion,
  updateUbicacion,
  deleteUbicacion,
  getUbicaciones,
  addInfraestructura,
  updateInfraestructura,
  deleteInfraestructura,
  getInfraestructura,
  addExclusion,
  updateExclusion,
  deleteExclusion,
  getExclusiones,
};
