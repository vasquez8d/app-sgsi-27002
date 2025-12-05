import * as SQLite from 'expo-sqlite';
import { generateId } from './helpers';

const DB_NAME = 'sgsi.db';

/**
 * Inserta 20 unidades organizativas de ejemplo para una empresa de fabricación de pinturas
 * Estructura organizacional realista con diferentes niveles jerárquicos
 */
export const insertUnidadesEjemplo = () => {
  const db = SQLite.openDatabaseSync(DB_NAME);
  
  // Verificar estructura de la tabla
  try {
    const tableInfo = db.getAllSync('PRAGMA table_info(alcance_unidades)');
    const tieneColumna = tableInfo.some(col => col.name === 'tipo');
    if (!tieneColumna) {
      console.warn('⚠️ Columna "tipo" no existe. Recreando tabla...');
      db.runSync('DROP TABLE IF EXISTS alcance_unidades');
      db.runSync(`
        CREATE TABLE alcance_unidades (
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
      console.log('✅ Tabla recreada');
    }
  } catch (error) {
    console.error('Error verificando estructura:', error);
  }
  
  // Primero eliminamos las unidades existentes para evitar duplicados
  try {
    db.runSync('DELETE FROM alcance_unidades');
    console.log('🗑️ Unidades anteriores eliminadas');
  } catch (error) {
    console.warn('No se pudieron eliminar unidades anteriores:', error);
  }
  
  const unidades = [
    // NIVEL 1: DIRECCIÓN (Alta Dirección)
    {
      id: generateId(),
      nombre_unidad: 'Dirección General',
      tipo: 'Dirección',
      nivel_jerarquico: 1,
      responsable: 'CEO - Carlos Mendoza',
      rol_sgsi: 'Sponsor',
      procesos_asociados: JSON.stringify(['Planificación Estratégica', 'Gobierno Corporativo']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Dirección de Operaciones',
      tipo: 'Dirección',
      nivel_jerarquico: 1,
      responsable: 'COO - María Rodríguez',
      rol_sgsi: 'Responsable de Seguridad',
      procesos_asociados: JSON.stringify(['Formulación de Pinturas', 'Mezclado y Pigmentación', 'Control de Calidad Final']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Dirección Comercial',
      tipo: 'Dirección',
      nivel_jerarquico: 1,
      responsable: 'CCO - Roberto Silva',
      rol_sgsi: 'Copartícipe',
      procesos_asociados: JSON.stringify(['Ventas Industriales', 'Ventas Retail', 'Exportaciones']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Dirección de Tecnología',
      tipo: 'Dirección',
      nivel_jerarquico: 1,
      responsable: 'CTO - Andrea López',
      rol_sgsi: 'Responsable de Seguridad',
      procesos_asociados: JSON.stringify(['Infraestructura TI', 'Seguridad de la Información', 'Desarrollo de Software']),
      incluida: 1,
      justificacion: null,
    },

    // NIVEL 2: GERENCIAS
    {
      id: generateId(),
      nombre_unidad: 'Gerencia de Producción',
      tipo: 'Gerencia',
      nivel_jerarquico: 2,
      responsable: 'Ing. Juan Pérez',
      rol_sgsi: 'Responsable de Seguridad',
      procesos_asociados: JSON.stringify(['Formulación de Pinturas', 'Mezclado y Pigmentación', 'Envasado y Etiquetado']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Gerencia de Calidad',
      tipo: 'Gerencia',
      nivel_jerarquico: 2,
      responsable: 'Lic. Patricia Gómez',
      rol_sgsi: 'Auditor Interno',
      procesos_asociados: JSON.stringify(['Control de Calidad de Insumos', 'Control de Calidad Final', 'Certificaciones ISO']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Gerencia de Ventas',
      tipo: 'Gerencia',
      nivel_jerarquico: 2,
      responsable: 'Lic. Fernando Castro',
      rol_sgsi: 'Copartícipe',
      procesos_asociados: JSON.stringify(['Ventas Industriales', 'Ventas Retail', 'Gestión de CRM']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Gerencia de TI',
      tipo: 'Gerencia',
      nivel_jerarquico: 2,
      responsable: 'Ing. Laura Martínez',
      rol_sgsi: 'Responsable de Seguridad',
      procesos_asociados: JSON.stringify(['Infraestructura TI', 'Seguridad de la Información', 'Soporte Técnico']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Gerencia de RRHH',
      tipo: 'Gerencia',
      nivel_jerarquico: 2,
      responsable: 'Lic. Carmen Flores',
      rol_sgsi: 'Copartícipe',
      procesos_asociados: JSON.stringify(['Recursos Humanos', 'Capacitación', 'Seguridad Ocupacional']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Gerencia Financiera',
      tipo: 'Gerencia',
      nivel_jerarquico: 2,
      responsable: 'CPA. Miguel Torres',
      rol_sgsi: 'Copartícipe',
      procesos_asociados: JSON.stringify(['Finanzas y Contabilidad', 'Tesorería', 'Control de Gestión']),
      incluida: 1,
      justificacion: null,
    },

    // NIVEL 3: DEPARTAMENTOS
    {
      id: generateId(),
      nombre_unidad: 'Departamento de Formulación',
      tipo: 'Departamento',
      nivel_jerarquico: 3,
      responsable: 'Ing. Químico José Vargas',
      rol_sgsi: 'Usuario Final',
      procesos_asociados: JSON.stringify(['Formulación de Pinturas', 'Investigación y Desarrollo']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Departamento de Control de Calidad',
      tipo: 'Departamento',
      nivel_jerarquico: 3,
      responsable: 'Ing. Sandra Ramírez',
      rol_sgsi: 'Auditor Interno',
      procesos_asociados: JSON.stringify(['Control de Calidad de Insumos', 'Control de Calidad Final', 'Laboratorio de Análisis']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Departamento de Compras',
      tipo: 'Departamento',
      nivel_jerarquico: 3,
      responsable: 'Lic. Ricardo Morales',
      rol_sgsi: 'Copartícipe',
      procesos_asociados: JSON.stringify(['Adquisición de Materias Primas', 'Gestión de Proveedores Químicos', 'Compras']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Departamento de Seguridad de la Información',
      tipo: 'Departamento',
      nivel_jerarquico: 3,
      responsable: 'Ing. Daniel Herrera',
      rol_sgsi: 'Responsable de Seguridad',
      procesos_asociados: JSON.stringify(['Seguridad de la Información', 'Gestión de Incidentes', 'Backup y Recuperación']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Departamento Legal',
      tipo: 'Departamento',
      nivel_jerarquico: 3,
      responsable: 'Abg. Lucía Paredes',
      rol_sgsi: 'Copartícipe',
      procesos_asociados: JSON.stringify(['Legal y Cumplimiento', 'Contratos', 'Propiedad Intelectual']),
      incluida: 1,
      justificacion: null,
    },

    // NIVEL 4: ÁREAS
    {
      id: generateId(),
      nombre_unidad: 'Área de Mezclado y Pigmentación',
      tipo: 'Área',
      nivel_jerarquico: 4,
      responsable: 'Téc. Pedro Jiménez',
      rol_sgsi: 'Usuario Final',
      procesos_asociados: JSON.stringify(['Mezclado y Pigmentación', 'Control de Colorimetría']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Área de Envasado',
      tipo: 'Área',
      nivel_jerarquico: 4,
      responsable: 'Téc. Ana Ruiz',
      rol_sgsi: 'Usuario Final',
      procesos_asociados: JSON.stringify(['Envasado y Etiquetado', 'Empaque de Productos']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Área de Logística',
      tipo: 'Área',
      nivel_jerarquico: 4,
      responsable: 'Lic. Carlos Díaz',
      rol_sgsi: 'Usuario Final',
      procesos_asociados: JSON.stringify(['Logística de Almacenamiento', 'Distribución Nacional', 'Gestión de Inventarios']),
      incluida: 1,
      justificacion: null,
    },

    // NIVEL 5: SECCIONES
    {
      id: generateId(),
      nombre_unidad: 'Sección de Soporte Técnico',
      tipo: 'Sección',
      nivel_jerarquico: 5,
      responsable: 'Téc. Luis Vega',
      rol_sgsi: 'Usuario Final',
      procesos_asociados: JSON.stringify(['Soporte Técnico', 'Mesa de Ayuda', 'Atención al Usuario']),
      incluida: 1,
      justificacion: null,
    },
    {
      id: generateId(),
      nombre_unidad: 'Sección de Marketing Digital',
      tipo: 'Sección',
      nivel_jerarquico: 5,
      responsable: 'Lic. Sofía Mendoza',
      rol_sgsi: 'Usuario Final',
      procesos_asociados: JSON.stringify(['E-commerce de Pinturas', 'Marketing Digital', 'Redes Sociales']),
      incluida: 1,
      justificacion: null,
    },
  ];

  let insertedCount = 0;

  try {
    unidades.forEach((unidad, index) => {
      try {
        db.runSync(
          `INSERT INTO alcance_unidades (
            id, nombre_unidad, tipo, nivel_jerarquico, responsable, 
            rol_sgsi, procesos_asociados, incluida, justificacion
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            unidad.id,
            unidad.nombre_unidad,
            unidad.tipo,
            unidad.nivel_jerarquico,
            unidad.responsable,
            unidad.rol_sgsi,
            unidad.procesos_asociados,
            unidad.incluida,
            unidad.justificacion,
          ]
        );
        insertedCount++;
        // Solo mostrar log cada 5 registros o el último
        if (index % 5 === 0 || index === unidades.length - 1) {
          console.log(`✓ Progreso: ${index + 1}/${unidades.length}`);
        }
      } catch (itemError) {
        console.error(`✗ Error insertando ${unidad.nombre_unidad}:`, itemError);
      }
    });

    // Verificar que se insertaron correctamente
    const result = db.getFirstSync('SELECT COUNT(*) as count FROM alcance_unidades');
    console.log(`✅ ${insertedCount} unidades insertadas. Total en BD: ${result.count}`);
    
    return insertedCount;
  } catch (error) {
    console.error('❌ Error al insertar unidades de ejemplo:', error);
    throw error;
  }
};
