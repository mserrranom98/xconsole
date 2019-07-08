import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { TerSelect, TerIU, TerDelete } from '../../pages-models/model-emp-rec';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class TerminalesService {
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
  ) {
  }

  getTer(ter: TerSelect) {
    ter.userName = VARGLOBAL.user;
    ter.peticion = "TERMINALES_SELECT";
    return this._http.post(this.urlPath,ter);
  }

  insertTer(ter: TerIU) {
    ter.userName = VARGLOBAL.user;
    ter.peticion = "TERMINALES_INSERT";
    return this._http.post(this.urlPath,ter);
  }
  updateTer(ter: TerIU) {
    ter.userName = VARGLOBAL.user;
    ter.peticion = "TERMINALES_UPDATE";
    return this._http.post(this.urlPath,ter);
  }

  deleteTer(ter: TerDelete) {
    ter.userName = VARGLOBAL.user;
    ter.peticion = "TERMINALES_DELETE";
    return this._http.post(this.urlPath,ter);
  }

}
