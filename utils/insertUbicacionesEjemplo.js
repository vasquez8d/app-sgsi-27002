import * as SQLite from 'expo-sqlite';
import { generateId } from './helpers';

const DB_NAME = 'sgsi.db';

/**
 * Inserta 15 ubicaciones físicas de ejemplo para una empresa de fabricación de pinturas
 * Incluye: plantas, oficinas, almacenes, laboratorios y centros de distribución
 */
export const insertUbicacionesEjemplo = () => {
  const db = SQLite.openDatabaseSync(DB_NAME);
  
  try {
    // Verificar que la tabla existe y tiene las columnas necesarias
    const tableInfo = db.getAllSync("PRAGMA table_info(alcance_ubicaciones)");
    
    if (tableInfo.length === 0) {
      console.error('❌ Tabla alcance_ubicaciones no existe');
      return { success: false, error: 'Tabla no existe' };
    }

    const ubicacionesEjemplo = [
      // Oficinas Principales
      {
        nombreSitio: 'Oficina Corporativa Lima',
        tipo: 'Oficina Principal',
        tiposActivo: ['Personas', 'Aplicaciones', 'Información', 'Hardware'],
        direccion: 'Av. Javier Prado Este 2875, San Borja, Lima',
        responsableSitio: 'Carlos Mendoza',
        incluido: true,
        coordenadas: { lat: -12.0897, lng: -77.0028 },
        observaciones: 'Sede administrativa principal con dirección general y áreas corporativas'
      },
      {
        nombreSitio: 'Centro de Operaciones Callao',
        tipo: 'Oficina Principal',
        tiposActivo: ['Personas', 'Aplicaciones', 'Hardware', 'Infraestructura'],
        direccion: 'Av. Argentina 3450, Callao',
        responsableSitio: 'María Torres',
        incluido: true,
        coordenadas: { lat: -12.0464, lng: -77.1181 },
        observaciones: 'Centro de coordinación de operaciones y logística'
      },
      // Plantas de Producción
      {
        nombreSitio: 'Planta Industrial Norte',
        tipo: 'Sucursal',
        tiposActivo: ['Personas', 'Hardware', 'Infraestructura'],
        direccion: 'Av. Néstor Gambetta Km 12, Ventanilla, Callao',
        responsableSitio: 'Roberto Vega',
        incluido: true,
        coordenadas: { lat: -11.8746, lng: -77.1324 },
        observaciones: 'Planta principal de producción de pinturas industriales y automotrices'
      },
      {
        nombreSitio: 'Planta Decorativa Sur',
        tipo: 'Sucursal',
        tiposActivo: ['Personas', 'Hardware', 'Infraestructura'],
        direccion: 'Carretera Panamericana Sur Km 35, Lurín, Lima',
        responsableSitio: 'Ana Quispe',
        incluido: true,
        coordenadas: { lat: -12.2745, lng: -76.8731 },
        observaciones: 'Especializada en pinturas arquitectónicas y decorativas'
      },
      // Almacenes y Distribución
      {
        nombreSitio: 'Centro de Distribución Principal',
        tipo: 'Data Center',
        tiposActivo: ['Aplicaciones', 'Hardware', 'Infraestructura'],
        direccion: 'Av. Colonial 1250, Ate, Lima',
        responsableSitio: 'Luis Ramírez',
        incluido: true,
        coordenadas: { lat: -12.0432, lng: -76.9897 },
        observaciones: 'Centro logístico principal con control de inventarios crítico'
      },
      {
        nombreSitio: 'Almacén Materias Primas Norte',
        tipo: 'Data Center',
        tiposActivo: ['Hardware', 'Infraestructura'],
        direccion: 'Av. Tomás Valle 1855, San Martín de Porres, Lima',
        responsableSitio: 'Jorge Castillo',
        incluido: true,
        coordenadas: { lat: -12.0234, lng: -77.0678 },
        observaciones: 'Almacenamiento de insumos químicos y materias primas'
      },
      // Laboratorios
      {
        nombreSitio: 'Laboratorio Control Calidad',
        tipo: 'Remoto',
        tiposActivo: ['Personas', 'Información', 'Hardware'],
        direccion: 'Av. Los Frutales 344, Ate, Lima',
        responsableSitio: 'Dra. Patricia Rojas',
        incluido: true,
        coordenadas: { lat: -12.0567, lng: -76.9812 },
        observaciones: 'Laboratorio de control de calidad y pruebas de producto'
      },
      {
        nombreSitio: 'Centro I+D e Innovación',
        tipo: 'Remoto',
        tiposActivo: ['Personas', 'Aplicaciones', 'Información'],
        direccion: 'Av. La Molina 1320, La Molina, Lima',
        responsableSitio: 'Dr. Martín Salazar',
        incluido: true,
        coordenadas: { lat: -12.0789, lng: -76.9432 },
        observaciones: 'Centro de investigación y desarrollo de nuevas formulaciones'
      },
      // Sucursales Regionales
      {
        nombreSitio: 'Sucursal Arequipa',
        tipo: 'Sucursal',
        tiposActivo: ['Personas', 'Aplicaciones'],
        direccion: 'Parque Industrial Río Seco, Arequipa',
        responsableSitio: 'Carmen Flores',
        incluido: true,
        coordenadas: { lat: -16.3988, lng: -71.5350 },
        observaciones: 'Oficina regional sur con almacén y distribución'
      },
      {
        nombreSitio: 'Sucursal Trujillo',
        tipo: 'Sucursal',
        tiposActivo: ['Personas', 'Aplicaciones'],
        direccion: 'Av. América Norte 2890, Trujillo',
        responsableSitio: 'Miguel Reyes',
        incluido: true,
        coordenadas: { lat: -8.1090, lng: -79.0215 },
        observaciones: 'Oficina regional norte con showroom'
      },
      // Sitios Cliente
      {
        nombreSitio: 'Almacén Cliente Retail Principal',
        tipo: 'Cliente',
        tiposActivo: ['Servicios tercerizados'],
        direccion: 'Av. Universitaria 1801, San Miguel, Lima',
        responsableSitio: 'External',
        incluido: false,
        coordenadas: { lat: -12.0764, lng: -77.0876 },
        observaciones: 'Almacén en instalaciones de cliente mayorista (excluido del alcance)'
      },
      {
        nombreSitio: 'Punto Venta Cliente Sodimac',
        tipo: 'Cliente',
        tiposActivo: ['Servicios tercerizados'],
        direccion: 'Av. Angamos Este 2681, Surquillo, Lima',
        responsableSitio: 'External',
        incluido: false,
        coordenadas: { lat: -12.1132, lng: -77.0089 },
        observaciones: 'Punto de venta en retail (fuera de alcance)'
      },
      // Oficinas Remotas
      {
        nombreSitio: 'Oficina Representación Cusco',
        tipo: 'Remoto',
        tiposActivo: ['Personas', 'Aplicaciones'],
        direccion: 'Av. La Cultura 1580, Cusco',
        responsableSitio: 'Rosa Huamán',
        incluido: false,
        coordenadas: { lat: -13.5226, lng: -71.9673 },
        observaciones: 'Oficina de representación regional (solo comercial, sin activos críticos)'
      },
      {
        nombreSitio: 'Punto Atención Iquitos',
        tipo: 'Remoto',
        tiposActivo: ['Personas'],
        direccion: 'Av. Abelardo Quiñones Km 2, Iquitos',
        responsableSitio: 'Pedro Silva',
        incluido: false,
        coordenadas: { lat: -3.7437, lng: -73.2516 },
        observaciones: 'Punto de atención sin almacén (excluido por alcance limitado)'
      },
      // Data Center (Backup)
      {
        nombreSitio: 'Data Center Respaldo',
        tipo: 'Data Center',
        tiposActivo: ['Aplicaciones', 'Hardware', 'Infraestructura'],
        direccion: 'Av. Canaval y Moreyra 522, San Isidro, Lima',
        responsableSitio: 'Fernando Díaz',
        incluido: true,
        coordenadas: { lat: -12.0931, lng: -77.0364 },
        observaciones: 'Centro de respaldo de sistemas críticos con redundancia'
      }
    ];

    // Eliminar tabla existente y recrearla con estructura correcta
    db.runSync('DROP TABLE IF EXISTS alcance_ubicaciones');
    console.log('📍 Tabla alcance_ubicaciones eliminada');
    
    db.execSync(`
      CREATE TABLE alcance_ubicaciones (
        id TEXT PRIMARY KEY,
        nombre_sitio TEXT NOT NULL,
        direccion TEXT,
        tipo TEXT NOT NULL,
        tipos_activo TEXT,
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
    console.log('📍 Tabla alcance_ubicaciones recreada con estructura actualizada');

    // Insertar nuevas ubicaciones
    let insertedCount = 0;
    const stmt = db.prepareSync(
      `INSERT INTO alcance_ubicaciones 
       (id, nombre_sitio, tipo, tipos_activo, direccion, responsable_sitio, incluido, latitud, longitud, observaciones) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    ubicacionesEjemplo.forEach((ubicacion, index) => {
      stmt.executeSync([
        generateId(),
        ubicacion.nombreSitio,
        ubicacion.tipo,
        JSON.stringify(ubicacion.tiposActivo),
        ubicacion.direccion,
        ubicacion.responsableSitio,
        ubicacion.incluido ? 1 : 0,
        ubicacion.coordenadas.lat,
        ubicacion.coordenadas.lng,
        ubicacion.observaciones
      ]);
      insertedCount++;
      
      // Log progreso cada 5 registros
      if ((index + 1) % 5 === 0) {
        console.log(`📍 Insertadas ${index + 1}/${ubicacionesEjemplo.length} ubicaciones...`);
      }
    });

    stmt.finalizeSync();

    // Verificar inserción
    const finalCount = db.getFirstSync('SELECT COUNT(*) as count FROM alcance_ubicaciones');
    
    console.log(`\n✅ Inserción completada: ${insertedCount} ubicaciones`);
    console.log(`📊 Resumen:`);
    console.log(`   - Total en BD: ${finalCount.count}`);
    console.log(`   - Incluidas: ${ubicacionesEjemplo.filter(u => u.incluido).length}`);
    console.log(`   - Excluidas: ${ubicacionesEjemplo.filter(u => !u.incluido).length}`);

    return { 
      success: true, 
      count: insertedCount,
      message: `${insertedCount} ubicaciones insertadas exitosamente` 
    };

  } catch (error) {
    console.error('❌ Error en insertUbicacionesEjemplo:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};
