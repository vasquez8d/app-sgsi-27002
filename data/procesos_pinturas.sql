-- Procesos de ejemplo para empresa de fabricación de pinturas
-- Ejecutar este script para poblar la base de datos con datos realistas

-- MACROPROCESO: OPERACIONES (Producción)
INSERT INTO alcance_procesos (id, macroproceso, nombre_proceso, responsable_area, descripcion, estado, criticidad, fecha_inclusion, procesos_relacionados) 
VALUES 
('proc-001', 'Operaciones', 'Producción de Pinturas Base Agua', 'Gerencia de Producción', 'Proceso de fabricación de pinturas ecológicas base agua para uso residencial e industrial', 'Incluido', 'Crítica', datetime('now'), '[]'),
('proc-002', 'Operaciones', 'Producción de Pinturas Base Solvente', 'Gerencia de Producción', 'Fabricación de pinturas industriales base solvente para aplicaciones especializadas', 'Incluido', 'Alta', datetime('now'), '[]'),
('proc-003', 'Operaciones', 'Control de Calidad de Productos', 'Laboratorio de Calidad', 'Inspección y pruebas de calidad de materias primas, productos en proceso y terminados', 'Incluido', 'Crítica', datetime('now'), '[]'),
('proc-004', 'Operaciones', 'Envasado y Etiquetado', 'Área de Envasado', 'Proceso de envasado en diferentes presentaciones y etiquetado según normativas', 'Incluido', 'Alta', datetime('now'), '[]'),
('proc-005', 'Operaciones', 'Mantenimiento de Equipos de Producción', 'Mantenimiento Industrial', 'Mantenimiento preventivo y correctivo de equipos de mezcla, molienda y envasado', 'Incluido', 'Media', datetime('now'), '[]');

-- MACROPROCESO: CAPTACIONES (Compras/Suministros)
INSERT INTO alcance_procesos (id, macroproceso, nombre_proceso, responsable_area, descripcion, estado, criticidad, fecha_inclusion, procesos_relacionados) 
VALUES 
('proc-006', 'Captaciones', 'Compra de Materias Primas', 'Gerencia de Compras', 'Adquisición de pigmentos, resinas, solventes y aditivos para la producción', 'Incluido', 'Crítica', datetime('now'), '[]'),
('proc-007', 'Captaciones', 'Gestión de Proveedores', 'Gerencia de Compras', 'Evaluación, selección y seguimiento de proveedores de materias primas', 'Incluido', 'Alta', datetime('now'), '[]'),
('proc-008', 'Captaciones', 'Control de Inventarios de Materias Primas', 'Almacén de Materias Primas', 'Gestión y control de stock de insumos para producción', 'Incluido', 'Alta', datetime('now'), '[]');

-- MACROPROCESO: COLOCACIONES (Ventas y Distribución)
INSERT INTO alcance_procesos (id, macroproceso, nombre_proceso, responsable_area, descripcion, estado, criticidad, fecha_inclusion, procesos_relacionados) 
VALUES 
('proc-009', 'Colocaciones', 'Ventas a Distribuidores', 'Gerencia Comercial', 'Gestión de ventas a distribuidores mayoristas y ferreterías', 'Incluido', 'Alta', datetime('now'), '[]'),
('proc-010', 'Colocaciones', 'Ventas Directas Industriales', 'Gerencia Comercial', 'Ventas especializadas para clientes industriales y constructoras', 'Incluido', 'Media', datetime('now'), '[]'),
('proc-011', 'Colocaciones', 'Logística y Distribución', 'Gerencia de Logística', 'Despacho, transporte y entrega de productos a clientes', 'Incluido', 'Alta', datetime('now'), '[]'),
('proc-012', 'Colocaciones', 'Gestión de Pedidos', 'Área de Ventas', 'Recepción, procesamiento y seguimiento de órdenes de compra', 'Incluido', 'Media', datetime('now'), '[]');

-- MACROPROCESO: GESTIÓN DE CANALES (Marketing)
INSERT INTO alcance_procesos (id, macroproceso, nombre_proceso, responsable_area, descripcion, estado, criticidad, fecha_inclusion, procesos_relacionados) 
VALUES 
('proc-013', 'Gestión de Canales', 'Marketing y Publicidad', 'Gerencia de Marketing', 'Campañas publicitarias, desarrollo de marca y estrategias comerciales', 'Incluido', 'Media', datetime('now'), '[]'),
('proc-014', 'Gestión de Canales', 'Atención al Cliente', 'Servicio al Cliente', 'Soporte técnico, asesoría y resolución de consultas de clientes', 'Incluido', 'Media', datetime('now'), '[]'),
('proc-015', 'Gestión de Canales', 'Desarrollo de Nuevos Productos', 'I+D', 'Investigación y desarrollo de nuevas formulaciones y productos', 'En Evaluación', 'Media', datetime('now'), '[]');

-- MACROPROCESO: TECNOLOGÍA (TI)
INSERT INTO alcance_procesos (id, macroproceso, nombre_proceso, responsable_area, descripcion, estado, criticidad, fecha_inclusion, procesos_relacionados) 
VALUES 
('proc-016', 'Tecnología', 'Sistema ERP de Gestión', 'Gerencia de TI', 'Administración del sistema integrado de gestión empresarial', 'Incluido', 'Crítica', datetime('now'), '[]'),
('proc-017', 'Tecnología', 'Infraestructura y Redes', 'Gerencia de TI', 'Gestión de servidores, redes y comunicaciones de la empresa', 'Incluido', 'Alta', datetime('now'), '[]'),
('proc-018', 'Tecnología', 'Seguridad de la Información', 'Gerencia de TI', 'Protección de datos, respaldos y controles de acceso', 'Incluido', 'Crítica', datetime('now'), '[]'),
('proc-019', 'Tecnología', 'Soporte Técnico Informático', 'Mesa de Ayuda TI', 'Atención de incidentes y soporte a usuarios internos', 'Incluido', 'Media', datetime('now'), '[]');

-- MACROPROCESO: SOPORTE (Administrativo)
INSERT INTO alcance_procesos (id, macroproceso, nombre_proceso, responsable_area, descripcion, estado, criticidad, fecha_inclusion, procesos_relacionados) 
VALUES 
('proc-020', 'Soporte', 'Gestión Financiera y Contable', 'Gerencia Financiera', 'Contabilidad, facturación, cobranzas y pagos', 'Incluido', 'Crítica', datetime('now'), '[]'),
('proc-021', 'Soporte', 'Gestión de Recursos Humanos', 'Gerencia de RRHH', 'Reclutamiento, capacitación, nómina y administración de personal', 'Incluido', 'Alta', datetime('now'), '[]'),
('proc-022', 'Soporte', 'Seguridad y Salud Ocupacional', 'Área de SSO', 'Prevención de riesgos laborales y cumplimiento normativo de seguridad', 'Incluido', 'Alta', datetime('now'), '[]'),
('proc-023', 'Soporte', 'Gestión Ambiental', 'Área de Medio Ambiente', 'Control de emisiones, residuos y cumplimiento de normativas ambientales', 'Incluido', 'Alta', datetime('now'), '[]'),
('proc-024', 'Soporte', 'Asesoría Legal', 'Gerencia Legal', 'Contratos, cumplimiento normativo y representación legal', 'En Evaluación', 'Baja', datetime('now'), '[]'),
('proc-025', 'Soporte', 'Servicios Generales', 'Administración', 'Limpieza, vigilancia, mantenimiento de instalaciones', 'Excluido', 'Baja', datetime('now'), '[]');
