import { executeQuery, getAllRows, getFirstRow } from '../database';
import { generateId } from '../../utils/helpers';
import * as SQLite from 'expo-sqlite';
import logger from '../../utils/logger';

const DB_NAME = 'sgsi.db';
let db = null;

const openDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
};

// ═══════════════════════════════════════════════════════════════
// INICIALIZACIÓN DE LA BASE DE DATOS
// ═══════════════════════════════════════════════════════════════

export const initAlcanceTables = () => {
  const database = openDatabase();
  
  try {
    // Tabla de metadata del alcance
    database.execSync(`
      CREATE TABLE IF NOT EXISTS alcance_metadata (
        id TEXT PRIMARY KEY,
        nombre_proyecto TEXT NOT NULL,
        departamento TEXT,
        version TEXT DEFAULT '1.0',
        estado TEXT DEFAULT 'Borrador',
        responsable_id TEXT,
        responsable_nombre TEXT,
        completitud INTEGER DEFAULT 0,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de procesos
    database.execSync(`
      CREATE TABLE IF NOT EXISTS alcance_procesos (
        id TEXT PRIMARY KEY,
        macroproceso TEXT NOT NULL,
        nombre_proceso TEXT NOT NULL,
        responsable_area TEXT,
        descripcion TEXT,
        estado TEXT DEFAULT 'En Evaluación',
        criticidad TEXT DEFAULT 'Media',
        fecha_inclusion DATETIME,
        procesos_relacionados TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de unidades organizativas
    database.execSync(`
      CREATE TABLE IF NOT EXISTS alcance_unidades (
        id TEXT PRIMARY KEY,
        nombre_unidad TEXT NOT NULL,
        tipo TEXT NOT NULL,
        nivel_jerarquico INTEGER DEFAULT 1,
        responsable TEXT,
        rol_sgsi TEXT DEFAULT 'Coparticipe',
        procesos_asociados TEXT,
        incluida INTEGER DEFAULT 1,
        justificacion TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de ubicaciones físicas
    database.execSync(`
      CREATE TABLE IF NOT EXISTS alcance_ubicaciones (
        id TEXT PRIMARY KEY,
        nombre_sitio TEXT NOT NULL,
        direccion TEXT,
        tipo TEXT NOT NULL,
        activos_presentes TEXT,
        responsable_sitio TEXT,
        incluido INTEGER DEFAULT 1,
        latitud REAL,
        longitud REAL,
        observaciones TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de infraestructura TI
    database.execSync(`
      CREATE TABLE IF NOT EXISTS alcance_infraestructura (
        id TEXT PRIMARY KEY,
        tipo_activo TEXT NOT NULL,
        identificador TEXT NOT NULL,
        ubicacion_id TEXT,
        propietario_area TEXT,
        sistema_operativo TEXT,
        funcion TEXT,
        criticidad TEXT DEFAULT 'Media',
        estado_activo TEXT DEFAULT 'Activo',
        incluido_alcance INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ubicacion_id) REFERENCES alcance_ubicaciones(id)
      )
    `);

    // Tabla de exclusiones
    database.execSync(`
      CREATE TABLE IF NOT EXISTS alcance_exclusiones (
        id TEXT PRIMARY KEY,
        elemento_excluido TEXT NOT NULL,
        categoria TEXT NOT NULL,
        justificacion TEXT NOT NULL,
        responsable_decision TEXT,
        fecha_exclusion DATETIME DEFAULT CURRENT_TIMESTAMP,
        revision_pendiente INTEGER DEFAULT 0,
        proxima_revision DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de validación y versiones
    database.execSync(`
      CREATE TABLE IF NOT EXISTS alcance_validacion (
        id TEXT PRIMARY KEY,
        alcance_id TEXT NOT NULL,
        version TEXT NOT NULL,
        fecha_validez DATE,
        propietario_doc TEXT,
        frecuencia_revision TEXT,
        proxima_revision DATE,
        preparado_por TEXT,
        aprobado_por TEXT,
        fecha_aprobacion DATETIME,
        descripcion_cambios TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inicializar metadata si no existe
    const result = database.getFirstSync('SELECT COUNT(*) as count FROM alcance_metadata');
    const count = result ? (result.count || 0) : 0;
    
    if (count === 0) {
      const id = generateId();
      database.runSync(
        `INSERT INTO alcance_metadata (id, nombre_proyecto, version, estado, completitud) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, 'SGSI ISO 27002:2013', '1.0', 'Borrador', 0]
      );
    }

    logger.database('AlcanceService', 'INIT', 'Tablas de Alcance inicializadas correctamente');
    return { success: true };
  } catch (error) {
    logger.error('AlcanceService', 'Error inicializando tablas de alcance', error);
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE OBTENCIÓN DE DATOS
// ═══════════════════════════════════════════════════════════════

export const getAlcanceData = async () => {
  try {
    logger.performanceStart('getAlcanceData');
    initAlcanceTables();

    const metadata = getFirstRow('SELECT * FROM alcance_metadata LIMIT 1') || {
      nombre_proyecto: 'SGSI ISO 27002:2013',
      version: '1.0',
      estado: 'Borrador',
      completitud: 0,
    };

    const procesos = getAllRows('SELECT * FROM alcance_procesos ORDER BY created_at DESC') || [];
    const unidades = getAllRows('SELECT * FROM alcance_unidades ORDER BY created_at DESC') || [];
    const ubicaciones = getAllRows('SELECT * FROM alcance_ubicaciones ORDER BY created_at DESC') || [];
    const infraestructura = getAllRows('SELECT * FROM alcance_infraestructura ORDER BY created_at DESC') || [];
    const exclusiones = getAllRows('SELECT * FROM alcance_exclusiones ORDER BY created_at DESC') || [];
    const validacion = getFirstRow('SELECT * FROM alcance_validacion ORDER BY created_at DESC LIMIT 1') || {
      fecha_validez: new Date(),
      proxima_revision: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    };

    return {
      metadata: {
        nombreProyecto: metadata.nombre_proyecto,
        departamento: metadata.departamento || '',
        version: metadata.version,
        estado: metadata.estado,
        completitud: metadata.completitud || 0,
        fechaCreacion: metadata.fecha_creacion,
        responsable: {
          id: metadata.responsable_id || '',
          nombre: metadata.responsable_nombre || '',
        },
      },
      procesos: procesos.map(p => ({
        id: p.id,
        macroproceso: p.macroproceso,
        nombreProceso: p.nombre_proceso,
        responsableArea: p.responsable_area,
        descripcion: p.descripcion,
        estado: p.estado,
        criticidad: p.criticidad,
        fechaInclusion: p.fecha_inclusion,
        procesosRelacionados: p.procesos_relacionados ? JSON.parse(p.procesos_relacionados) : [],
      })),
      unidades: unidades.map(u => ({
        id: u.id,
        nombreUnidad: u.nombre_unidad,
        tipo: u.tipo,
        nivelJerarquico: u.nivel_jerarquico,
        responsable: u.responsable,
        rolSGSI: u.rol_sgsi,
        procesosAsociados: u.procesos_asociados ? JSON.parse(u.procesos_asociados) : [],
        incluida: Boolean(u.incluida),
        justificacion: u.justificacion,
      })),
      ubicaciones: ubicaciones.map(ub => ({
        id: ub.id,
        nombreSitio: ub.nombre_sitio,
        direccion: ub.direccion,
        tipo: ub.tipo,
        activosPresentes: ub.activos_presentes ? JSON.parse(ub.activos_presentes) : [],
        responsableSitio: ub.responsable_sitio,
        incluido: Boolean(ub.incluido),
        coordenadas: ub.latitud && ub.longitud ? { lat: ub.latitud, lng: ub.longitud } : null,
        observaciones: ub.observaciones,
      })),
      infraestructura: infraestructura.map(i => ({
        id: i.id,
        tipoActivo: i.tipo_activo,
        identificador: i.identificador,
        ubicacionId: i.ubicacion_id,
        propietarioArea: i.propietario_area,
        sistemaOperativo: i.sistema_operativo,
        funcion: i.funcion,
        criticidad: i.criticidad,
        estadoActivo: i.estado_activo,
        incluidoAlcance: Boolean(i.incluido_alcance),
      })),
      exclusiones: exclusiones.map(e => ({
        id: e.id,
        elementoExcluido: e.elemento_excluido,
        categoria: e.categoria,
        justificacion: e.justificacion,
        responsableDecision: e.responsable_decision,
        fechaExclusion: e.fecha_exclusion,
        revisionPendiente: Boolean(e.revision_pendiente),
        proximaRevision: e.proxima_revision,
      })),
      validacion: {
        fechaValidez: validacion.fecha_validez,
        propietarioDoc: validacion.propietario_doc || '',
        frecuenciaRevision: validacion.frecuencia_revision || 'Trimestral',
        proximaRevision: validacion.proxima_revision,
        historialCambios: [],
        aprobaciones: [],
      },
    };
  } catch (error) {
    console.error('Error obteniendo datos de alcance:', error);
    return {
      metadata: {
        nombreProyecto: 'SGSI ISO 27002:2013',
        version: '1.0',
        estado: 'Borrador',
        completitud: 0,
      },
      procesos: [],
      unidades: [],
      ubicaciones: [],
      infraestructura: [],
      exclusiones: [],
      validacion: {
        fechaValidez: new Date(),
        proximaRevision: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// CÁLCULO DE COMPLETITUD
// ═══════════════════════════════════════════════════════════════

export const calculateCompletitud = (data) => {
  try {
    let score = 0;
    const maxScore = 100;

    // Metadata (10 puntos)
    if (data.metadata.nombreProyecto) score += 5;
    if (data.metadata.responsable?.nombre) score += 5;

    // Procesos (25 puntos)
    if (data.procesos.length >= 5) score += 15;
    else if (data.procesos.length >= 1) score += 10;
    
    const procesosIncluidos = data.procesos.filter(p => p.estado === 'Incluido').length;
    if (procesosIncluidos >= 1) score += 10;

    // Unidades (20 puntos)
    if (data.unidades.length >= 3) score += 10;
    else if (data.unidades.length >= 1) score += 5;
    
    const unidadesIncluidas = data.unidades.filter(u => u.incluida).length;
    if (unidadesIncluidas >= 1) score += 10;

    // Ubicaciones (15 puntos)
    if (data.ubicaciones.length >= 1) score += 10;
    const ubicacionesIncluidas = data.ubicaciones.filter(u => u.incluido).length;
    if (ubicacionesIncluidas >= 1) score += 5;

    // Infraestructura (15 puntos)
    if (data.infraestructura.length >= 3) score += 10;
    else if (data.infraestructura.length >= 1) score += 5;
    
    const infraIncluida = data.infraestructura.filter(i => i.incluidoAlcance).length;
    if (infraIncluida >= 1) score += 5;

    // Exclusiones (10 puntos)
    if (data.exclusiones.length >= 1) {
      const conJustificacion = data.exclusiones.filter(e => e.justificacion && e.justificacion.length >= 50).length;
      if (conJustificacion === data.exclusiones.length) score += 10;
      else score += 5;
    }

    // Validación (5 puntos)
    if (data.validacion.propietarioDoc) score += 5;

    return Math.min(Math.round(score), maxScore);
  } catch (error) {
    console.error('Error calculando completitud:', error);
    return 0;
  }
};

// ═══════════════════════════════════════════════════════════════
// ACTUALIZAR COMPLETITUD
// ═══════════════════════════════════════════════════════════════

export const updateCompletitud = async () => {
  try {
    const data = await getAlcanceData();
    const completitud = calculateCompletitud(data);
    
    executeQuery(
      'UPDATE alcance_metadata SET completitud = ?, fecha_actualizacion = CURRENT_TIMESTAMP',
      [completitud]
    );
    
    return { success: true, completitud };
  } catch (error) {
    console.error('Error actualizando completitud:', error);
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════
// GUARDAR METADATA
// ═══════════════════════════════════════════════════════════════

export const saveMetadata = async (metadata) => {
  try {
    executeQuery(
      `UPDATE alcance_metadata SET 
       nombre_proyecto = ?,
       departamento = ?,
       version = ?,
       estado = ?,
       responsable_id = ?,
       responsable_nombre = ?,
       fecha_actualizacion = CURRENT_TIMESTAMP`,
      [
        metadata.nombreProyecto,
        metadata.departamento || '',
        metadata.version,
        metadata.estado,
        metadata.responsable?.id || '',
        metadata.responsable?.nombre || '',
      ]
    );
    
    return { success: true };
  } catch (error) {
    logger.error('AlcanceService', 'Error guardando metadata', error);
    return { success: false, error: error.message };
  }
};

export default {
  initAlcanceTables,
  getAlcanceData,
  calculateCompletitud,
  updateCompletitud,
  saveMetadata,
};
