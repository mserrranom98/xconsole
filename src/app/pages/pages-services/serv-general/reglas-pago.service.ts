import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { RegPagoSelect, RegPagoInsert, RegPagoDelete } from "../../pages-models/model-general";
import { VARGLOBAL } from "../../../services/login-pass.service";
//import * as cors from "cors";
import { GLOBAL_PATH } from "../global";

@Injectable()
export class ReglasPagoService {

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
  
  
  getReglasPago(regla: RegPagoSelect){
    regla.userName = VARGLOBAL.user;
    regla.peticion = "REGLASPAGO_SELECT";
    return this._http.post(this.urlPath,regla); 
  }

  insertReglasPago(regla: RegPagoInsert){
    regla.userName = VARGLOBAL.user;
    regla.peticion = "REGLASPAGO_INSERT";
    return this._http.post(this.urlPath,regla);
  }

  deleteReglasPago(regla: RegPagoDelete){
    regla.userName = VARGLOBAL.user;
    regla.peticion = "REGLASPAGO_DELETE";
    return this._http.post(this.urlPath,regla);
  }
}