// Journal
export class JournalSelect {
  constructor(
    public peticion: string,
    public userName: string,
    public startDate: string,
    public endDate: string,
    public cajero: string,
    public terminal: string
  ) {
  }
}

// Turnos
export class TurnosSelect {
  constructor(
    public peticion: string,
    public userName: string,
    public rex: string,
    public sucursal: string,
    public startDate: string,
    public endDate: string
  ) {
  }
}

// Turnos Detalle
export class TurnosDetSelect {
  constructor(
    public peticion: string,
    public userName: string,
    public usuario: string,
    public turno: string
  ) {
  }
}

// Turnos Montos
export class TurnosMontosSelect {
  constructor(
    public peticion: string,
    public userName: string,
    public rex: string,
    public sucursal: string,
    public usuario: string,
    public turno: string
  ) {
  }
}

// Turnos Respuesta
export class DatosTurno {
  constructor(
    public peticion: string,
    public usuario: string,
    public turno: string,
    public terminal: string,
    public terminalDescripcion: string,
    public abierto: string,
    public intentosCierre: string,
    public fechaCierre: string,
    public numero: string
  ) {
  }
}

// Operaciones
export class OprLevelI {
  constructor(
    public peticion: string,
    public userName: string,
    public startDate: string,
    public endDate: string,
    public rex: string,
    public eps: string,
    public sucursalList: string[],
    public terminalList: string[],
    public tipoList: string[],
    public estadoList: string[],
    public instrumentoList: string[],
    public mpList: string[],
    public contexto: string[]
  ) {
  }
}

// Detalle Operaciones
export class OprLevelII {
  constructor(
    public peticion: string,
    public userName: string,
    public usuario: string,
    public turno: string,
    public operacion: string
  ) {
  }
}

// Detalle Ticket
export class OprLevelIII {
  constructor(
    public peticion: string,
    public userName: string,
    public usuario: string,
    public turno: string,
    public operacion: string,
    public detalle: string,
    public instrumento: string
  ) {
  }
}

export class ResultI {
  constructor(
    public peticion: string,
    public contexto: string,
    public estado: string,
    public estadoGlosa: string,
    public fechaRecaudacion: string,
    public fechaRegistro: string,
    public folio: string,
    public monto: string,
    public operacion: string,
    public rex: string,
    public rexGlosa: string,
    public sucursal: string,
    public sucursalGlosa: string,
    public terminal: string,
    public terminalGlosa: string,
    public tipo: string,
    public tipoGlosa: string,
    public turno: string,
    public usuario: string
  ) {
  }
}

// Cardinalidad
export class CardinalidadSelect {
  constructor(
    public peticion: string,
    public userName: string
  ) {
  }
}
// Insert Cardinalidad
export class CardinalidadI {
  constructor(
    public peticion: string,
    public userName: string,
    public empresa: string,
    public medioPago1: string,
    public cardinalidadMedioPago1: string,
    public medioPago2: string,
    public cardinalidadMedioPago2: string
  ) {
  }
}

// Delete Cardinalidad
export class CardinalidadDelete {
  constructor(
    public peticion: string,
    public userName: string,
    public regla: string
  ) {
  }
}

// Reglas de Pago
export class RegPagoSelect {
  constructor(
    public peticion: string,
    public userName: string
  ) {
  }
}

// Insertar Regla de Pago
export class RegPagoInsert {
  constructor(
    public peticion: string,
    public userName: string,
    public numeroEmpresas: string,
    public mediosPago: string
   // public rows: [{ codigo: string }]
  ) {
  }
}

// Borrar Regla de Pago
export class RegPagoDelete {
  constructor(
    public peticion: string,
    public userName: string,
    public regla: string
  ) {
  }
}

// Restricciones
export class RestricSelect {
  constructor(
    public peticion: string,
    public userName: string
  ) {
  }
}

// Restricciones Empresas
export class RestricEmpresas {
  constructor(
    public peticion: string,
    public userName: string
  ) {
  }
}

// Restricciones Sucursales
export class RestricSucursales {
  constructor(
    public peticion: string,
    public userName: string,
    public rex: string
  ) {
  }
}

// Restricciones Instrumentos
export class RestricInstrumentos {
  constructor(
    public peticion: string,
    public userName: string,
    public eps: string
  ) {
  }
}

// Insertar Restriccion
export class RestricInsert {
  constructor(
    public peticion: string,
    public userName: string,
    public concepto1: string,
    public codigo1: string,
    public concepto2: string,
    public codigo2: string
  ) {
  }
}

// Borrar Restriccion
export class RestricDelete {
  constructor(
    public peticion: string,
    public userName: string,
    public regla: string
  ) {
  }
}
