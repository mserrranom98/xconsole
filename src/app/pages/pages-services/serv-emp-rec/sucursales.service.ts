import { Injectable } from '@angular/core';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { SucSelect, SucIU, SucDelete } from '../../pages-models/model-emp-rec';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class SucursalesService {
  urlPath = GLOBAL_PATH.getPath;
/*  options_cors:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: false,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: '*',
    preflightContinue: false
  };
*/
  constructor(public _http: HttpClient
  ) {}

  getSuc(suc: SucSelect) {
    suc.userName = VARGLOBAL.user;
    suc.peticion = "SUCURSALES_SELECT";
    return this._http.post(this.urlPath,suc);
  }

  insertSuc(suc: SucIU) {
    suc.userName = VARGLOBAL.user;
    suc.peticion = "SUCURSALES_INSERT";
    return this._http.post(this.urlPath,suc);
  }
  updateSuc(suc: SucIU) {
    suc.userName = VARGLOBAL.user;
    suc.peticion = "SUCURSALES_UPDATE";
    return this._http.post(this.urlPath,suc);
  }
  deleteSuc(suc: SucDelete) {
    suc.peticion = "SUCURSALES_DELETE";
    return this._http.post(this.urlPath,suc);
  }


}
