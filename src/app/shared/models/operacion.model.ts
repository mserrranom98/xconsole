export class OperacionModel {
  contexto: any[];
  endDate: String;
  eps: String;
  estadoList: any[];
  instrumentoList: any[];
  mpList: any[];
  peticion: String;
  rex: String;
  startDate: String;
  sucursalList: Sucursal[];
  terminalList: String;
  tipoList: any[];
  userName: String;
}

export class Sucursal {
  descripcion: String;
  properties: any[];
  rex: String;
  sucursal: String;
}
