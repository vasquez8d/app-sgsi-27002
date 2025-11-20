// ═══════════════════════════════════════════════════════════════
// VALIDACIONES PARA MÓDULO DE ALCANCE
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────
// VALIDACIÓN DE PROCESOS
// ───────────────────────────────────────────────────────────────

export const validateProceso = (proceso) => {
  const errors = {};

  if (!proceso.macroproceso || proceso.macroproceso.trim() === '') {
    errors.macroproceso = 'El macroproceso es obligatorio';
  }

  if (!proceso.nombreProceso || proceso.nombreProceso.trim() === '') {
    errors.nombreProceso = 'El nombre del proceso es obligatorio';
  } else if (proceso.nombreProceso.length < 3) {
    errors.nombreProceso = 'El nombre debe tener al menos 3 caracteres';
  } else if (proceso.nombreProceso.length > 100) {
    errors.nombreProceso = 'El nombre no puede exceder 100 caracteres';
  }

  if (proceso.descripcion && proceso.descripcion.length > 500) {
    errors.descripcion = 'La descripción no puede exceder 500 caracteres';
  }

  if (!proceso.criticidad) {
    errors.criticidad = 'La criticidad es obligatoria';
  }

  if (!proceso.estado) {
    errors.estado = 'El estado es obligatorio';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ───────────────────────────────────────────────────────────────
// VALIDACIÓN DE UNIDADES ORGANIZATIVAS
// ───────────────────────────────────────────────────────────────

export const validateUnidad = (unidad) => {
  const errors = {};

  if (!unidad.nombreUnidad || unidad.nombreUnidad.trim() === '') {
    errors.nombreUnidad = 'El nombre de la unidad es obligatorio';
  } else if (unidad.nombreUnidad.length < 3) {
    errors.nombreUnidad = 'El nombre debe tener al menos 3 caracteres';
  } else if (unidad.nombreUnidad.length > 100) {
    errors.nombreUnidad = 'El nombre no puede exceder 100 caracteres';
  }

  if (!unidad.tipo || unidad.tipo.trim() === '') {
    errors.tipo = 'El tipo de unidad es obligatorio';
  }

  if (!unidad.nivelJerarquico || unidad.nivelJerarquico < 1 || unidad.nivelJerarquico > 5) {
    errors.nivelJerarquico = 'El nivel jerárquico debe estar entre 1 y 5';
  }

  if (!unidad.rolSGSI || unidad.rolSGSI.trim() === '') {
    errors.rolSGSI = 'El rol en el SGSI es obligatorio';
  }

  if (!unidad.incluida && (!unidad.justificacion || unidad.justificacion.trim() === '')) {
    errors.justificacion = 'Si no se incluye, debe proporcionar una justificación';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ───────────────────────────────────────────────────────────────
// VALIDACIÓN DE UBICACIONES
// ───────────────────────────────────────────────────────────────

export const validateUbicacion = (ubicacion) => {
  const errors = {};

  if (!ubicacion.nombreSitio || ubicacion.nombreSitio.trim() === '') {
    errors.nombreSitio = 'El nombre del sitio es obligatorio';
  } else if (ubicacion.nombreSitio.length < 3) {
    errors.nombreSitio = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!ubicacion.tipo || ubicacion.tipo.trim() === '') {
    errors.tipo = 'El tipo de ubicación es obligatorio';
  }

  if (ubicacion.coordenadas) {
    if (ubicacion.coordenadas.lat < -90 || ubicacion.coordenadas.lat > 90) {
      errors.coordenadas = 'La latitud debe estar entre -90 y 90';
    }
    if (ubicacion.coordenadas.lng < -180 || ubicacion.coordenadas.lng > 180) {
      errors.coordenadas = 'La longitud debe estar entre -180 y 180';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ───────────────────────────────────────────────────────────────
// VALIDACIÓN DE INFRAESTRUCTURA
// ───────────────────────────────────────────────────────────────

export const validateInfraestructura = (infra) => {
  const errors = {};

  if (!infra.tipoActivo || infra.tipoActivo.trim() === '') {
    errors.tipoActivo = 'El tipo de activo es obligatorio';
  }

  if (!infra.identificador || infra.identificador.trim() === '') {
    errors.identificador = 'El identificador es obligatorio';
  } else if (infra.identificador.length < 3) {
    errors.identificador = 'El identificador debe tener al menos 3 caracteres';
  }

  if (!infra.criticidad) {
    errors.criticidad = 'La criticidad es obligatoria';
  }

  if (!infra.estadoActivo) {
    errors.estadoActivo = 'El estado del activo es obligatorio';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ───────────────────────────────────────────────────────────────
// VALIDACIÓN DE EXCLUSIONES
// ───────────────────────────────────────────────────────────────

export const validateExclusion = (exclusion) => {
  const errors = {};

  if (!exclusion.elementoExcluido || exclusion.elementoExcluido.trim() === '') {
    errors.elementoExcluido = 'El elemento excluido es obligatorio';
  } else if (exclusion.elementoExcluido.length < 3) {
    errors.elementoExcluido = 'El elemento debe tener al menos 3 caracteres';
  }

  if (!exclusion.categoria || exclusion.categoria.trim() === '') {
    errors.categoria = 'La categoría es obligatoria';
  }

  if (!exclusion.justificacion || exclusion.justificacion.trim() === '') {
    errors.justificacion = 'La justificación es obligatoria';
  } else if (exclusion.justificacion.length < 50) {
    errors.justificacion = 'La justificación debe tener al menos 50 caracteres para cumplir con ISO 27001';
  } else if (exclusion.justificacion.length > 1000) {
    errors.justificacion = 'La justificación no puede exceder 1000 caracteres';
  }

  if (!exclusion.responsableDecision || exclusion.responsableDecision.trim() === '') {
    errors.responsableDecision = 'El responsable de la decisión es obligatorio';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ───────────────────────────────────────────────────────────────
// VALIDACIÓN DE METADATA
// ───────────────────────────────────────────────────────────────

export const validateMetadata = (metadata) => {
  const errors = {};

  if (!metadata.nombreProyecto || metadata.nombreProyecto.trim() === '') {
    errors.nombreProyecto = 'El nombre del proyecto es obligatorio';
  } else if (metadata.nombreProyecto.length < 3) {
    errors.nombreProyecto = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!metadata.version || !metadata.version.match(/^\d+\.\d+$/)) {
    errors.version = 'La versión debe tener formato X.Y (ej: 1.0)';
  }

  if (!metadata.estado) {
    errors.estado = 'El estado es obligatorio';
  }

  if (metadata.completitud < 0 || metadata.completitud > 100) {
    errors.completitud = 'La completitud debe estar entre 0 y 100';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateProceso,
  validateUnidad,
  validateUbicacion,
  validateInfraestructura,
  validateExclusion,
  validateMetadata,
};
