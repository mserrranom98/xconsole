// Bitacora
export class BitSelect {
    constructor(
        public peticion: string,
        public userName: string,
        public startDate: string,
        public endDate: string
    ) {
    }
  }

  export class BitLevel1 {
    constructor(
        public peticion: string,
        public startDate: string,
        public endDate: string,
        public userName: string,
        public module: string,
        public objet: string
    ) {
    }
  }

  export class BitLevel2 {
    constructor(
        public peticion: string,
        public startDate: string,
        public endDate: string,
        public id: string
    ) {
    }
  }

  // Notificacion
export class NotiSelect {
    constructor(
        public userName: string,
        public receiver: string
    ) {
    }
  }

  export class NotiPick {
    constructor(
        public userName: string,
        public receiver: string,
        public id: string
    ) {
    }
  }

  export class NotiDone {
    constructor(
        public userName: string,
        public id: string,
        public reply: string,
        public granted: string,
    ) {
    }
  }

// Turnos Abiertos
export class TurnosAbiertosSelect {
    constructor(
        public peticion: string,
        public userName: string,
        public rex: string,
        public sucursal: string,
        public startDate: string,
        public endDate: string,
        public terminal: string
    ) {
    }
  }

// Turnos Cierre
export class TurnosCierre {
    constructor(
        public peticion: string,
        public userName: string,
        public rex: string,
        public sucursal: string,
        public terminal: string,
        public usuario: string,
        public turno: string,
        public rows: [{ medioPago: string, monto: string }]
    ) {
    }
  }

// Rendicion
export class RendicionSelect {
    constructor(
        public peticion: string,
        public userName: string
    ) {
    }
}

export class RendicionInsert {
    constructor(
        public peticion: string,
        public userName: string
    ) {
    }
}
