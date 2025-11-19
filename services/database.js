import * as SQLite from 'expo-sqlite';

const DB_NAME = 'sgsi.db';

// Abrir o crear la base de datos
let db = null;

const openDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
};

// Inicializar todas las tablas
export const initDatabase = () => {
  const database = openDatabase();
  
  try {
    // Tabla de usuarios/autenticación
    database.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        role TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de equipo
    database.execSync(`
      CREATE TABLE IF NOT EXISTS team_members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        department TEXT,
        responsibilities TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de alcance
    database.execSync(`
      CREATE TABLE IF NOT EXISTS scope (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT,
        included INTEGER DEFAULT 1,
        justification TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de activos
    database.execSync(`
      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        owner TEXT,
        location TEXT,
        criticality TEXT,
        value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de políticas
    database.execSync(`
      CREATE TABLE IF NOT EXISTS policies (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT,
        version TEXT,
        status TEXT,
        responsible TEXT,
        approval_date TEXT,
        review_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de riesgos
    database.execSync(`
      CREATE TABLE IF NOT EXISTS risks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        asset_id TEXT,
        threat TEXT,
        vulnerability TEXT,
        probability TEXT,
        impact TEXT,
        risk_level TEXT,
        treatment TEXT,
        status TEXT,
        owner TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (asset_id) REFERENCES assets(id)
      );
    `);

    // Tabla de controles
    database.execSync(`
      CREATE TABLE IF NOT EXISTS controls (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        domain TEXT NOT NULL,
        description TEXT,
        objective TEXT,
        status TEXT,
        implementation_date TEXT,
        responsible TEXT,
        evidence TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insertar usuario administrador por defecto si no existe
    const result = database.getFirstSync('SELECT COUNT(*) as count FROM users');
    if (result.count === 0) {
      database.runSync(
        'INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)',
        ['admin', 'admin123', 'Administrador SGSI', 'admin@sgsi.com', 'CISO']
      );
    }

    console.log('✅ Base de datos inicializada correctamente');
    return { success: true };
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    return { success: false, error: error.message };
  }
};

// Función helper para ejecutar consultas
export const executeQuery = (sql, params = []) => {
  const database = openDatabase();
  try {
    return database.runSync(sql, params);
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  }
};

// Función helper para obtener todos los resultados
export const getAllRows = (sql, params = []) => {
  const database = openDatabase();
  try {
    return database.getAllSync(sql, params);
  } catch (error) {
    console.error('Error obteniendo filas:', error);
    return [];
  }
};

// Función helper para obtener una sola fila
export const getFirstRow = (sql, params = []) => {
  const database = openDatabase();
  try {
    return database.getFirstSync(sql, params);
  } catch (error) {
    console.error('Error obteniendo fila:', error);
    return null;
  }
};

// Limpiar toda la base de datos (útil para desarrollo)
export const clearDatabase = () => {
  const database = openDatabase();
  try {
    database.execSync('DROP TABLE IF EXISTS users');
    database.execSync('DROP TABLE IF EXISTS team_members');
    database.execSync('DROP TABLE IF EXISTS scope');
    database.execSync('DROP TABLE IF EXISTS assets');
    database.execSync('DROP TABLE IF EXISTS policies');
    database.execSync('DROP TABLE IF EXISTS risks');
    database.execSync('DROP TABLE IF EXISTS controls');
    console.log('✅ Base de datos limpiada');
    return { success: true };
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    return { success: false, error: error.message };
  }
};

export default {
  initDatabase,
  executeQuery,
  getAllRows,
  getFirstRow,
  clearDatabase,
};
