import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { OprLevelI, OprLevelII, OprLevelIII } from '../../pages-models/model-general';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class OperacionesService {
  urlPath = GLOBAL_PATH.getPath;
/*  options_cors:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: false,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: '*',
    preflightContinue: false
  };
*/
  constructor(
    public _http: HttpClient
  ) {}

  // Consulta de Operaciones Nivel I
  getOperacionesI(opr: OprLevelI) {
    opr.userName = VARGLOBAL.user;
    opr.peticion = "OPERACIONES_LEVEL1";
    return this._http.post(this.urlPath,opr);
  }

  // Consulta de Operaciones Nivel II
  getOperacionesII(opr: OprLevelII) {
    opr.userName = VARGLOBAL.user;
    opr.peticion = "OPERACIONES_LEVEL2";
    return this._http.post(this.urlPath,opr);
  }

  // Consulta de Operaciones Nivel III
  getOperacionesIII(opr: OprLevelIII) {
    opr.userName = VARGLOBAL.user;
    opr.peticion = "OPERACIONES_LEVEL3";
    return this._http.post(this.urlPath,opr);
  }

  getExportar(opr: OprLevelI) {
    opr.userName = VARGLOBAL.user;
    opr.peticion = "OPERACIONES_EXPORTAR";
    return this._http.post(this.urlPath,opr);
  }

}
