export class CuentasSelect {
    constructor(
      public peticion: string,
      public userName: string,
      public activo: string
    ) {}
 }

 export class VoucherSelect {
    constructor(
      public peticion: string,
      public userName: string,
      public fechacons: string
    ) {}
 }

 export class VoucherExport {
  constructor(
    public peticion: string,
    public userName: string,
    public fechacons: string
    ) {}
}

 export class EditarCuentas {
  constructor(
    public peticion: string,
    public userName: string,
    public cuenta: string,
    public centroCosto: string,
    public glosaCuenta: string,
    public producto: string,
    public activo: string
  ) {}
}

export class CrearCuentas {
  constructor(
    public peticion: string,
    public userName: string,
    public cuenta: string,
    public centroCosto: string,
    public glosaCuenta: string,
    public producto: string
  ) {}
}


/*
  Models para los Select de instrumento
*/

export class CuentaContableActiva {
  constructor(
    public peticion: string,
    public userName: string
    ) {}
}

export class InstrumentoNoPago {
  constructor(
    public peticion: string,
    public userName: string
    ) {}
}

export class MediosPago {
  constructor(
    public peticion: string,
    public userName: string
    ) {}
}
/* Fin Models Select */


/* CUENTAS CONTABLES INSTRUMENTOS CURD */

export class CCIDelete {
  constructor(
    public peticion: string,
    public userName: string,
    public cuenta: string,
    public tipoCuenta: string
    ) {}
}

export class CCIInsert {
  constructor(
    public peticion: string,
    public userName: string,
    public cuenta: string,
    public instrumento: string,
    public tipoCuenta: string,
    public estado: string
    ) {}
}

export class CCISelect {
  constructor(
    public peticion: string,
    public userName: string
    ) {}
}
/* Fin Crud CCI */
