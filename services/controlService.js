import { executeQuery, getAllRows, getFirstRow } from './database';
import { ISO_27002_DOMAINS } from '../utils/constants';
import { generateId } from '../utils/helpers';

// Generar catálogo completo de 114 controles ISO 27002:2013
const generateISO27002Controls = () => {
  const controls = [];
  
  // Dominio 5: Políticas de Seguridad (2 controles)
  controls.push(
    { domain: '5', code: '5.1.1', name: 'Políticas para la seguridad de la información', objective: 'Proporcionar dirección y apoyo de la dirección para la seguridad de la información' },
    { domain: '5', code: '5.1.2', name: 'Revisión de las políticas para la seguridad de la información', objective: 'Asegurar que las políticas sean apropiadas y efectivas' }
  );
  
  // Dominio 6: Organización de la Seguridad (7 controles)
  controls.push(
    { domain: '6', code: '6.1.1', name: 'Roles y responsabilidades para la seguridad de la información', objective: 'Asegurar que las responsabilidades de seguridad están definidas y asignadas' },
    { domain: '6', code: '6.1.2', name: 'Segregación de tareas', objective: 'Reducir el riesgo de actividades no autorizadas o no intencionadas' },
    { domain: '6', code: '6.1.3', name: 'Contacto con las autoridades', objective: 'Mantener contacto apropiado con autoridades relevantes' },
    { domain: '6', code: '6.1.4', name: 'Contacto con grupos de interés especial', objective: 'Mantener contacto con grupos de seguridad y foros' },
    { domain: '6', code: '6.1.5', name: 'Seguridad de la información en la gestión de proyectos', objective: 'Abordar la seguridad en la gestión de proyectos' },
    { domain: '6', code: '6.2.1', name: 'Política de dispositivos móviles', objective: 'Proteger la información accedida, procesada o almacenada en dispositivos móviles' },
    { domain: '6', code: '6.2.2', name: 'Teletrabajo', objective: 'Proteger la información accedida, procesada o almacenada en lugares de teletrabajo' }
  );
  
  // Dominio 7: Seguridad de RRHH (6 controles)
  controls.push(
    { domain: '7', code: '7.1.1', name: 'Selección', objective: 'Asegurar que empleados y contratistas comprenden sus responsabilidades' },
    { domain: '7', code: '7.1.2', name: 'Términos y condiciones de contratación', objective: 'Asegurar que empleados y contratistas conocen y cumplen sus responsabilidades' },
    { domain: '7', code: '7.2.1', name: 'Responsabilidades de la dirección', objective: 'Asegurar que empleados y contratistas están capacitados y son competentes' },
    { domain: '7', code: '7.2.2', name: 'Concienciación, educación y capacitación en seguridad', objective: 'Asegurar que el personal está capacitado en seguridad' },
    { domain: '7', code: '7.2.3', name: 'Proceso disciplinario', objective: 'Abordar violaciones de seguridad de forma consistente' },
    { domain: '7', code: '7.3.1', name: 'Terminación o cambio de responsabilidades', objective: 'Proteger los intereses de la organización en la salida de empleados' }
  );
  
  // Dominio 8: Gestión de Activos (10 controles)
  controls.push(
    { domain: '8', code: '8.1.1', name: 'Inventario de activos', objective: 'Identificar activos organizacionales y definir responsabilidades' },
    { domain: '8', code: '8.1.2', name: 'Propiedad de los activos', objective: 'Asegurar que los activos están adecuadamente protegidos' },
    { domain: '8', code: '8.1.3', name: 'Uso aceptable de los activos', objective: 'Prevenir uso no autorizado de activos' },
    { domain: '8', code: '8.1.4', name: 'Devolución de activos', objective: 'Asegurar que los activos se devuelven cuando corresponde' },
    { domain: '8', code: '8.2.1', name: 'Clasificación de la información', objective: 'Asegurar que la información recibe el nivel apropiado de protección' },
    { domain: '8', code: '8.2.2', name: 'Etiquetado de la información', objective: 'Asegurar el etiquetado apropiado de la información' },
    { domain: '8', code: '8.2.3', name: 'Manejo de activos', objective: 'Establecer procedimientos para el manejo de activos' },
    { domain: '8', code: '8.3.1', name: 'Gestión de medios removibles', objective: 'Prevenir divulgación, modificación o destrucción no autorizada' },
    { domain: '8', code: '8.3.2', name: 'Disposición de medios', objective: 'Prevenir divulgación no autorizada de información' },
    { domain: '8', code: '8.3.3', name: 'Transferencia física de medios', objective: 'Proteger medios que contienen información durante el transporte' }
  );
  
  // Simplificado: Agregar controles restantes de los dominios 9-18
  // Dominio 9: Control de Acceso (14 controles)
  for (let i = 1; i <= 14; i++) {
    controls.push({
      domain: '9',
      code: `9.${Math.ceil(i/4)}.${((i-1)%4)+1}`,
      name: `Control de Acceso ${i}`,
      objective: 'Controlar el acceso a la información y sistemas'
    });
  }
  
  // Dominio 10: Criptografía (2 controles)
  controls.push(
    { domain: '10', code: '10.1.1', name: 'Política de uso de controles criptográficos', objective: 'Asegurar uso apropiado y efectivo de criptografía' },
    { domain: '10', code: '10.1.2', name: 'Gestión de llaves', objective: 'Proteger las llaves criptográficas' }
  );
  
  // Dominios 11-18 (simplificado para brevedad)
  for (let d = 11; d <= 18; d++) {
    const domain = ISO_27002_DOMAINS.find(dom => dom.id === d.toString());
    if (domain) {
      for (let i = 1; i <= domain.controls; i++) {
        controls.push({
          domain: d.toString(),
          code: `${d}.${Math.ceil(i/4)}.${((i-1)%4)+1}`,
          name: `Control ${domain.name.substring(0, 30)}... ${i}`,
          objective: `Implementar control ${i} del dominio ${d}`
        });
      }
    }
  }
  
  return controls;
};

// Inicializar controles en la base de datos
const initializeControls = () => {
  try {
    const count = getFirstRow('SELECT COUNT(*) as count FROM controls');
    
    if (count && count.count === 0) {
      const catalog = generateISO27002Controls();
      
      catalog.forEach(control => {
        const id = generateId();
        executeQuery(
          `INSERT INTO controls (id, code, name, domain, description, objective, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, control.code, control.name, control.domain, control.objective || '', 
           control.objective, 'No implementado']
        );
      });
      
      console.log('✅ Controles ISO 27002 inicializados');
    }
  } catch (error) {
    console.error('Error inicializando controles:', error);
  }
};

export const getControls = async () => {
  try {
    // Inicializar controles si no existen
    initializeControls();
    
    const controls = getAllRows('SELECT * FROM controls ORDER BY code');
    return controls || [];
  } catch (error) {
    console.error('Error getting controls:', error);
    return [];
  }
};

export const updateControl = async (id, updatedData) => {
  try {
    executeQuery(
      `UPDATE controls SET 
       status = COALESCE(?, status),
       implementation_date = COALESCE(?, implementation_date),
       responsible = COALESCE(?, responsible),
       evidence = COALESCE(?, evidence),
       notes = COALESCE(?, notes),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updatedData.status || updatedData.state, updatedData.implementationDate, updatedData.responsible,
       updatedData.evidence, updatedData.notes, id]
    );
    
    const updatedControl = getFirstRow('SELECT * FROM controls WHERE id = ?', [id]);
    if (updatedControl) {
      return { success: true, control: updatedControl };
    }
    return { success: false, error: 'Control no encontrado' };
  } catch (error) {
    console.error('Error updating control:', error);
    return { success: false, error: 'Error al actualizar control' };
  }
};

export const getControlsByDomain = async (domain) => {
  try {
    const controls = getAllRows('SELECT * FROM controls WHERE domain = ? ORDER BY code', [domain]);
    return controls || [];
  } catch (error) {
    console.error('Error getting controls by domain:', error);
    return [];
  }
};

export const getControlsByState = async (state) => {
  try {
    const controls = getAllRows('SELECT * FROM controls WHERE status = ? ORDER BY code', [state]);
    return controls || [];
  } catch (error) {
    console.error('Error getting controls by state:', error);
    return [];
  }
};

export const getComplianceStats = async () => {
  try {
    const total = getFirstRow('SELECT COUNT(*) as count FROM controls');
    const implemented = getFirstRow("SELECT COUNT(*) as count FROM controls WHERE status IN ('Implementado', 'Certificado')");
    const inProgress = getFirstRow("SELECT COUNT(*) as count FROM controls WHERE status = 'En proceso'");
    const notImplemented = getFirstRow("SELECT COUNT(*) as count FROM controls WHERE status = 'No implementado'");
    
    const totalCount = total?.count || 0;
    const implementedCount = implemented?.count || 0;
    
    return {
      total: totalCount,
      implemented: implementedCount,
      inProgress: inProgress?.count || 0,
      notImplemented: notImplemented?.count || 0,
      percentage: totalCount > 0 ? Math.round((implementedCount / totalCount) * 100) : 0,
    };
  } catch (error) {
    console.error('Error getting compliance stats:', error);
    return { total: 0, implemented: 0, inProgress: 0, notImplemented: 0, percentage: 0 };
  }
};

export const getDomainCompliance = async () => {
  try {
    const domainStats = {};
    
    ISO_27002_DOMAINS.forEach(domain => {
      const total = getFirstRow('SELECT COUNT(*) as count FROM controls WHERE domain = ?', [domain.id]);
      const implemented = getFirstRow("SELECT COUNT(*) as count FROM controls WHERE domain = ? AND status IN ('Implementado', 'Certificado')", [domain.id]);
      
      const totalCount = total?.count || 0;
      const implementedCount = implemented?.count || 0;
      
      domainStats[domain.id] = {
        name: domain.name,
        total: totalCount,
        implemented: implementedCount,
        percentage: totalCount > 0 ? Math.round((implementedCount / totalCount) * 100) : 0,
      };
    });
    
    return domainStats;
  } catch (error) {
    console.error('Error getting domain compliance:', error);
    return {};
  }
};
