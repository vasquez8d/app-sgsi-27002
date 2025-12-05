import * as SQLite from 'expo-sqlite';
import { generateId } from './helpers';

const DB_NAME = 'sgsi.db';

/**
 * Script para insertar datos de ejemplo de infraestructura
 * Incluye: identificador, tipo de activo, sitio, unidad de negocio, ubicación física, propietario
 */
export const insertInfraestructuraEjemplo = () => {
  const db = SQLite.openDatabaseSync(DB_NAME);
  
  try {
    // Eliminar tabla existente y recrearla con el esquema correcto
    db.execSync('DROP TABLE IF EXISTS alcance_infraestructura');
    
    db.execSync(`
      CREATE TABLE alcance_infraestructura (
        id TEXT PRIMARY KEY,
        identificador TEXT NOT NULL,
        tipo_activo TEXT NOT NULL,
        sitio TEXT,
        unidad_negocio TEXT,
        ubicacion_fisica TEXT,
        propietario TEXT,
        sistema_operativo TEXT,
        funcion TEXT,
        criticidad TEXT DEFAULT 'Media',
        estado_activo TEXT DEFAULT 'Activo',
        incluido INTEGER DEFAULT 1,
        observaciones TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const infraestructuraEjemplo = [
      // Hardware - Servidores
      {
        identificador: 'Servidor Aplicaciones APP-01',
        tipoActivo: 'Hardware',
        sitio: 'Oficina Central',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Javier Prado Este 2499, San Borja',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Windows Server 2019',
        funcion: 'Servidor de aplicaciones corporativas',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Servidor principal para aplicaciones de negocio'
      },
      {
        identificador: 'Servidor Aplicaciones APP-02',
        tipoActivo: 'Hardware',
        sitio: 'Oficina Central',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Javier Prado Este 2499, San Borja',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Windows Server 2022',
        funcion: 'Servidor de respaldo y balanceo de carga',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Servidor secundario para redundancia'
      },
      // Aplicaciones - Bases de Datos
      {
        identificador: 'Servidor Base Datos DB-PROD-01',
        tipoActivo: 'Aplicaciones',
        sitio: 'Data Center Principal',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Néstor Gambetta Km 12, Ventanilla',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Linux Ubuntu 22.04 LTS',
        funcion: 'Base de datos principal de producción',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'PostgreSQL 14 - Base de datos transaccional'
      },
      {
        identificador: 'Servidor Base Datos DB-TEST-01',
        tipoActivo: 'Aplicaciones',
        sitio: 'Data Center Principal',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Néstor Gambetta Km 12, Ventanilla',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Linux Ubuntu 22.04 LTS',
        funcion: 'Base de datos de pruebas y desarrollo',
        criticidad: 'Media',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'PostgreSQL 14 - Ambiente de testing'
      },
      // Firewall y Seguridad
      {
        identificador: 'Firewall Perimetral FW-CORE-01',
        tipoActivo: 'Infraestructura',
        sitio: 'Data Center Principal',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Néstor Gambetta Km 12, Ventanilla',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'FortiOS 7.2',
        funcion: 'Firewall perimetral y gestión de seguridad',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'FortiGate 200F - Protección perimetral'
      },
      {
        identificador: 'Firewall Aplicaciones WAF-01',
        tipoActivo: 'Aplicaciones',
        sitio: 'Data Center Principal',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Néstor Gambetta Km 12, Ventanilla',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Linux Debian 11',
        funcion: 'Web Application Firewall',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'ModSecurity WAF - Protección de aplicaciones web'
      },
      // Almacenamiento
      {
        identificador: 'Storage SAN-PROD-01',
        tipoActivo: 'Hardware',
        sitio: 'Data Center Principal',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Néstor Gambetta Km 12, Ventanilla',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Firmware HPE 3PAR OS',
        funcion: 'Almacenamiento SAN principal',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'HPE 3PAR - 50TB útiles'
      },
      {
        identificador: 'Storage NAS-BACKUP-01',
        tipoActivo: 'Hardware',
        sitio: 'Data Center Secundario',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Argentina 3450, Callao',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Synology DSM 7',
        funcion: 'Respaldo y archivo de datos',
        criticidad: 'Media',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Synology RS2421+ - 80TB para backups'
      },
      // Dispositivos de Red
      {
        identificador: 'Switch Core SW-CORE-01',
        tipoActivo: 'Infraestructura',
        sitio: 'Data Center Principal',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Néstor Gambetta Km 12, Ventanilla',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Cisco IOS XE 17.6',
        funcion: 'Switch core de red principal',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Cisco Catalyst 9300 - 48 puertos 10Gbps'
      },
      {
        identificador: 'Router Principal RTR-01',
        tipoActivo: 'Infraestructura',
        sitio: 'Data Center Principal',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Néstor Gambetta Km 12, Ventanilla',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Cisco IOS 15.9',
        funcion: 'Router principal de conexión a Internet',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Cisco ISR 4451 - Doble enlace ISP'
      },
      // Estaciones de Trabajo
      {
        identificador: 'Workstation Finanzas WS-FIN-01',
        tipoActivo: 'Hardware',
        sitio: 'Oficina Central',
        unidadNegocio: 'Finanzas',
        ubicacionFisica: 'Av. Javier Prado Este 2499, San Borja',
        propietario: 'Gerencia de Finanzas',
        sistemaOperativo: 'Windows 11 Pro',
        funcion: 'Estación de trabajo para área de finanzas',
        criticidad: 'Media',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Dell OptiPlex 7090 - i7 11va gen'
      },
      {
        identificador: 'Workstation RRHH WS-RRHH-01',
        tipoActivo: 'Hardware',
        sitio: 'Oficina Central',
        unidadNegocio: 'Recursos Humanos',
        ubicacionFisica: 'Av. Javier Prado Este 2499, San Borja',
        propietario: 'Gerencia de RRHH',
        sistemaOperativo: 'Windows 11 Pro',
        funcion: 'Estación de trabajo para recursos humanos',
        criticidad: 'Baja',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'HP EliteDesk 800 G8'
      },
      // Laptops
      {
        identificador: 'Laptop Gerencia LAP-GER-01',
        tipoActivo: 'Hardware',
        sitio: 'Oficina Central',
        unidadNegocio: 'Gerencia General',
        ubicacionFisica: 'Av. Javier Prado Este 2499, San Borja',
        propietario: 'Gerencia General',
        sistemaOperativo: 'Windows 11 Pro',
        funcion: 'Laptop para equipo gerencial',
        criticidad: 'Media',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Lenovo ThinkPad X1 Carbon Gen 10'
      },
      {
        identificador: 'Laptop IT Admin LAP-IT-01',
        tipoActivo: 'Hardware',
        sitio: 'Oficina Central',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Javier Prado Este 2499, San Borja',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'Windows 11 Pro',
        funcion: 'Laptop para administración de sistemas',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Dell Latitude 5530 con herramientas de administración'
      },
      // Equipos en mantenimiento/retirados
      {
        identificador: 'Servidor Legacy SRV-OLD-01',
        tipoActivo: 'Hardware',
        sitio: 'Oficina Callao',
        unidadNegocio: 'Operaciones',
        ubicacionFisica: 'Av. Argentina 3450, Callao',
        propietario: 'Gerencia de Operaciones',
        sistemaOperativo: 'Windows Server 2012 R2',
        funcion: 'Servidor legacy en proceso de migración',
        criticidad: 'Baja',
        estadoActivo: 'Mantenimiento',
        incluido: false,
        observaciones: 'Programado para retirar en Q1 2026'
      },
      // Personas
      {
        identificador: 'Equipo de Desarrollo Software',
        tipoActivo: 'Personas',
        sitio: 'Oficina Central',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Javier Prado Este 2499, San Borja',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'N/A',
        funcion: 'Desarrollo y mantenimiento de aplicaciones',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: '8 desarrolladores con acceso a repositorios y ambientes'
      },
      {
        identificador: 'Administradores de Base de Datos',
        tipoActivo: 'Personas',
        sitio: 'Oficina Central',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Javier Prado Este 2499, San Borja',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'N/A',
        funcion: 'Administración y respaldo de bases de datos',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: '3 DBAs con acceso privilegiado a sistemas críticos'
      },
      // Información
      {
        identificador: 'Base de Datos de Clientes',
        tipoActivo: 'Información',
        sitio: 'Data Center Principal',
        unidadNegocio: 'Comercial',
        ubicacionFisica: 'Av. Néstor Gambetta Km 12, Ventanilla',
        propietario: 'Gerencia Comercial',
        sistemaOperativo: 'N/A',
        funcion: 'Almacenamiento de información de clientes',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Datos personales protegidos por Ley 29733'
      },
      {
        identificador: 'Repositorio de Documentación Técnica',
        tipoActivo: 'Información',
        sitio: 'Oficina Central',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Av. Javier Prado Este 2499, San Borja',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'N/A',
        funcion: 'Documentación técnica y procedimientos',
        criticidad: 'Media',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'SharePoint con documentación de sistemas y procesos'
      },
      // Servicios Tercerizados
      {
        identificador: 'Servicio de Cloud Computing AWS',
        tipoActivo: 'Servicios tercerizados',
        sitio: 'Cloud - US East',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'AWS Virginia',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'N/A',
        funcion: 'Infraestructura en la nube para aplicaciones web',
        criticidad: 'Alta',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Contrato anual con SLA 99.9% - EC2, RDS, S3'
      },
      {
        identificador: 'Servicio de Soporte Técnico Externo',
        tipoActivo: 'Servicios tercerizados',
        sitio: 'Remoto',
        unidadNegocio: 'Informática',
        ubicacionFisica: 'Proveedor externo',
        propietario: 'Gerencia de Informática',
        sistemaOperativo: 'N/A',
        funcion: 'Mesa de ayuda y soporte técnico nivel 1',
        criticidad: 'Media',
        estadoActivo: 'Activo',
        incluido: true,
        observaciones: 'Contrato con empresa local - 24/7'
      },
    ];

    // Insertar los registros
    const insertQuery = `
      INSERT INTO alcance_infraestructura 
      (id, identificador, tipo_activo, sitio, unidad_negocio, ubicacion_fisica, propietario,
       sistema_operativo, funcion, criticidad, estado_activo, incluido, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    infraestructuraEjemplo.forEach((infra, index) => {
      const id = generateId();
      db.runSync(insertQuery, [
        id,
        infra.identificador,
        infra.tipoActivo,
        infra.sitio,
        infra.unidadNegocio,
        infra.ubicacionFisica,
        infra.propietario,
        infra.sistemaOperativo,
        infra.funcion,
        infra.criticidad,
        infra.estadoActivo,
        infra.incluido ? 1 : 0,
        infra.observaciones,
      ]);
    });

    console.log(`✅ Se insertaron ${infraestructuraEjemplo.length} registros de infraestructura de ejemplo`);
    return { success: true, count: infraestructuraEjemplo.length };
  } catch (error) {
    console.error('❌ Error insertando infraestructura de ejemplo:', error);
    return { success: false, error: error.message };
  }
};
