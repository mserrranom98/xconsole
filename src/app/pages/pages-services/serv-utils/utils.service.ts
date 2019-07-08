import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { GetUtils } from '../../pages-models/model-utils';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class UtilsService {
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

  // Medio de Pago
  getMedioPago(med: GetUtils) {
    med.userName = VARGLOBAL.user;
    med.peticion = "UTILS_MEDIOSPAGOGET";
    return this._http.post(this.urlPath,med);
  }

  // Instrumentos y Medios de Pago
  getInstrumentos(ins: GetUtils) {
    ins.userName = VARGLOBAL.user;
    ins.peticion = "UTILS_INSTRUMENTOSGET";
    return this._http.post(this.urlPath,ins);
  }

  // Empresas EPS
  getEmpEps(emp: GetUtils) {
    emp.userName = VARGLOBAL.user;
    emp.peticion = "UTILS_EPSGET";
    return this._http.post(this.urlPath,emp);
  }
}
