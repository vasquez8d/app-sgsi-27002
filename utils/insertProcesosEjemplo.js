import { executeQuery } from '../services/database';

export const insertProcesosEjemplo = () => {
  const procesos = [
    { id: 'proc-001', macroproceso: 'Operaciones', nombreProceso: 'Producción de Pinturas Base Agua', responsableArea: 'Gerencia de Producción', descripcion: 'Proceso de fabricación de pinturas ecológicas base agua para uso residencial e industrial', estado: 'Incluido', criticidad: 'Crítica' },
    { id: 'proc-002', macroproceso: 'Operaciones', nombreProceso: 'Producción de Pinturas Base Solvente', responsableArea: 'Gerencia de Producción', descripcion: 'Fabricación de pinturas industriales base solvente para aplicaciones especializadas', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-003', macroproceso: 'Operaciones', nombreProceso: 'Control de Calidad de Productos', responsableArea: 'Laboratorio de Calidad', descripcion: 'Inspección y pruebas de calidad de materias primas, productos en proceso y terminados', estado: 'Incluido', criticidad: 'Crítica' },
    { id: 'proc-004', macroproceso: 'Operaciones', nombreProceso: 'Envasado y Etiquetado', responsableArea: 'Área de Envasado', descripcion: 'Proceso de envasado en diferentes presentaciones y etiquetado según normativas', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-005', macroproceso: 'Operaciones', nombreProceso: 'Mantenimiento de Equipos de Producción', responsableArea: 'Mantenimiento Industrial', descripcion: 'Mantenimiento preventivo y correctivo de equipos de mezcla, molienda y envasado', estado: 'Incluido', criticidad: 'Media' },
    { id: 'proc-006', macroproceso: 'Captaciones', nombreProceso: 'Compra de Materias Primas', responsableArea: 'Gerencia de Compras', descripcion: 'Adquisición de pigmentos, resinas, solventes y aditivos para la producción', estado: 'Incluido', criticidad: 'Crítica' },
    { id: 'proc-007', macroproceso: 'Captaciones', nombreProceso: 'Gestión de Proveedores', responsableArea: 'Gerencia de Compras', descripcion: 'Evaluación, selección y seguimiento de proveedores de materias primas', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-008', macroproceso: 'Captaciones', nombreProceso: 'Control de Inventarios de Materias Primas', responsableArea: 'Almacén de Materias Primas', descripcion: 'Gestión y control de stock de insumos para producción', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-009', macroproceso: 'Colocaciones', nombreProceso: 'Ventas a Distribuidores', responsableArea: 'Gerencia Comercial', descripcion: 'Gestión de ventas a distribuidores mayoristas y ferreterías', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-010', macroproceso: 'Colocaciones', nombreProceso: 'Ventas Directas Industriales', responsableArea: 'Gerencia Comercial', descripcion: 'Ventas especializadas para clientes industriales y constructoras', estado: 'Incluido', criticidad: 'Media' },
    { id: 'proc-011', macroproceso: 'Colocaciones', nombreProceso: 'Logística y Distribución', responsableArea: 'Gerencia de Logística', descripcion: 'Despacho, transporte y entrega de productos a clientes', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-012', macroproceso: 'Colocaciones', nombreProceso: 'Gestión de Pedidos', responsableArea: 'Área de Ventas', descripcion: 'Recepción, procesamiento y seguimiento de órdenes de compra', estado: 'Incluido', criticidad: 'Media' },
    { id: 'proc-013', macroproceso: 'Gestión de Canales', nombreProceso: 'Marketing y Publicidad', responsableArea: 'Gerencia de Marketing', descripcion: 'Campañas publicitarias, desarrollo de marca y estrategias comerciales', estado: 'Incluido', criticidad: 'Media' },
    { id: 'proc-014', macroproceso: 'Gestión de Canales', nombreProceso: 'Atención al Cliente', responsableArea: 'Servicio al Cliente', descripcion: 'Soporte técnico, asesoría y resolución de consultas de clientes', estado: 'Incluido', criticidad: 'Media' },
    { id: 'proc-015', macroproceso: 'Gestión de Canales', nombreProceso: 'Desarrollo de Nuevos Productos', responsableArea: 'I+D', descripcion: 'Investigación y desarrollo de nuevas formulaciones y productos', estado: 'En Evaluación', criticidad: 'Media' },
    { id: 'proc-016', macroproceso: 'Tecnología', nombreProceso: 'Sistema ERP de Gestión', responsableArea: 'Gerencia de TI', descripcion: 'Administración del sistema integrado de gestión empresarial', estado: 'Incluido', criticidad: 'Crítica' },
    { id: 'proc-017', macroproceso: 'Tecnología', nombreProceso: 'Infraestructura y Redes', responsableArea: 'Gerencia de TI', descripcion: 'Gestión de servidores, redes y comunicaciones de la empresa', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-018', macroproceso: 'Tecnología', nombreProceso: 'Seguridad de la Información', responsableArea: 'Gerencia de TI', descripcion: 'Protección de datos, respaldos y controles de acceso', estado: 'Incluido', criticidad: 'Crítica' },
    { id: 'proc-019', macroproceso: 'Tecnología', nombreProceso: 'Soporte Técnico Informático', responsableArea: 'Mesa de Ayuda TI', descripcion: 'Atención de incidentes y soporte a usuarios internos', estado: 'Incluido', criticidad: 'Media' },
    { id: 'proc-020', macroproceso: 'Soporte', nombreProceso: 'Gestión Financiera y Contable', responsableArea: 'Gerencia Financiera', descripcion: 'Contabilidad, facturación, cobranzas y pagos', estado: 'Incluido', criticidad: 'Crítica' },
    { id: 'proc-021', macroproceso: 'Soporte', nombreProceso: 'Gestión de Recursos Humanos', responsableArea: 'Gerencia de RRHH', descripcion: 'Reclutamiento, capacitación, nómina y administración de personal', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-022', macroproceso: 'Soporte', nombreProceso: 'Seguridad y Salud Ocupacional', responsableArea: 'Área de SSO', descripcion: 'Prevención de riesgos laborales y cumplimiento normativo de seguridad', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-023', macroproceso: 'Soporte', nombreProceso: 'Gestión Ambiental', responsableArea: 'Área de Medio Ambiente', descripcion: 'Control de emisiones, residuos y cumplimiento de normativas ambientales', estado: 'Incluido', criticidad: 'Alta' },
    { id: 'proc-024', macroproceso: 'Soporte', nombreProceso: 'Asesoría Legal', responsableArea: 'Gerencia Legal', descripcion: 'Contratos, cumplimiento normativo y representación legal', estado: 'En Evaluación', criticidad: 'Baja' },
    { id: 'proc-025', macroproceso: 'Soporte', nombreProceso: 'Servicios Generales', responsableArea: 'Administración', descripcion: 'Limpieza, vigilancia, mantenimiento de instalaciones', estado: 'Excluido', criticidad: 'Baja' }
  ];

  let insertados = 0;
  procesos.forEach(p => {
    try {
      executeQuery(
        `INSERT INTO alcance_procesos (id, macroproceso, nombre_proceso, responsable_area, descripcion, estado, criticidad, fecha_inclusion, procesos_relacionados) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.macroproceso, p.nombreProceso, p.responsableArea, p.descripcion, p.estado, p.criticidad, new Date().toISOString(), '[]']
      );
      insertados++;
    } catch (error) {
      console.log(`Error insertando ${p.nombreProceso}:`, error.message);
    }
  });
  
  console.log(`✅ ${insertados} procesos insertados exitosamente`);
  return insertados;
};
