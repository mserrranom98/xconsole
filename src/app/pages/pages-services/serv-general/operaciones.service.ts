import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OprLevelI, OprLevelII, OprLevelIII } from '../../pages-models/model-general';
import { VARGLOBAL } from '../../../services/login-pass.service';
import { GLOBAL_PATH } from '../global';

@Injectable()
export class OperacionesService {
  urlPath = GLOBAL_PATH.getPath;

  constructor(
    public _http: HttpClient
  ) {}

  getOperaciones(opr: any) {
    opr.userName = VARGLOBAL.user;
    opr.peticion = 'OPERACIONES_SELECT';
    return this._http.post(this.urlPath, opr);
  }

  // Consulta de Operaciones Nivel I
  getOperacionesI(opr: OprLevelI) {
    opr.userName = VARGLOBAL.user;
    opr.peticion = 'OPERACIONES_LEVEL1';
    return this._http.post(this.urlPath, opr);
  }

  // Consulta de Operaciones Nivel II
  getOperacionesII(opr: OprLevelII) {
    opr.userName = VARGLOBAL.user;
    opr.peticion = 'OPERACIONES_LEVEL2';
    return this._http.post(this.urlPath, opr);
  }

  // Consulta de Operaciones Nivel III
  getOperacionesIII(opr: OprLevelIII) {
    opr.userName = VARGLOBAL.user;
    opr.peticion = 'OPERACIONES_LEVEL3';
    return this._http.post(this.urlPath, opr);
  }

  getExportar(opr: any) {
    opr.userName = VARGLOBAL.user;
    opr.peticion = 'OPERACIONES_EXPORTAR';
    return this._http.post(this.urlPath, opr);
  }

}
