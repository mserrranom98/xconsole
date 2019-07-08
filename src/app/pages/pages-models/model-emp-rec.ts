// Empresas REXS
export class RexSelect {
  constructor(
    public peticion: string,
    public userName: string
  ) {
  }
}

export class RexIU {
  constructor(
    public peticion: string,
    public userName: string,
    public rex: string,
    public descripcion: string
  ) {
  }
}

export class RexDelete {
  constructor(
    public peticion: string,
    public userName: string,
    public rex: string
  ) {
  }
}

// Sucursales
export class SucSelect {
  constructor(
    public peticion: string,
    public userName: string,
    public rex: string
  ) {
  }
}

export class SucIU {
  constructor(
    public peticion: string,
      public userName: string,
      public sucursal: string,
      public rex: string,
      public descripcion: string,
      public properties: {
        email: string,
        montosLimites: [
          { medioPago: string, monto: string }
        ],
        referencias: string,
        responsable: string
      }
  ) {
  }
}

export class SucDelete {
  constructor(
    public peticion: string,
    public userName: string,
    public rex: string,
    public sucursal: string
  ) {
  }
}

// Terminales
export class TerSelect {
  constructor(
    public peticion: string,
    public userName: string,
    public rex: string,
    public sucursal: string
  ) {
  }
}

export class TerIU {
  constructor(
    public peticion: string,
      public userName: string,
      public rex: string,
      public sucursal: string,
      public terminal: string,
      public saf: string,
      public ubicacion: string,
      public bloqueado: string,
      public descripcion: string,
      public numeroCaja: string,
      public properties: {
        cajero: string,
        referencias: string,
        autorizacionLimites: [
          { medioPago: string, monto: string }
        ],
        montosLimites: [
          { medioPago: string, monto: string }
        ],
      }
  ) {
  }
}

export class TerDelete {
  constructor(
    public peticion: string,
    public userName: string,
    public rex: string,
    public sucursal: string,
    public terminal: string
  ) {
  }
}

