import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//*import { Http, RequestOptions, Headers } from '@angular/http';
import { RestricSelect, RestricEmpresas, RestricSucursales, RestricInstrumentos, RestricInsert, RestricDelete } from "../../pages-models/model-general";
import { VARGLOBAL } from "../../../services/login-pass.service";
//*import * as cors from "cors";
import { GLOBAL_PATH } from "../global";

@Injectable()
export class RestriccionesService { 

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
  
  getRestricciones(restriccion: RestricSelect){
    restriccion.userName = VARGLOBAL.user;
    restriccion.peticion = "RESTRICCIONES_SELECT";
    return this._http.post(this.urlPath,restriccion);
  }

  getRestricEmpresas(restriccion: RestricEmpresas){
    restriccion.userName = VARGLOBAL.user;
    restriccion.peticion = "RESTRICCIONES_EMPRESAS";
    return this._http.post(this.urlPath,restriccion);
  }

  getRestricSucursales(restriccion: RestricSucursales){
    restriccion.userName = VARGLOBAL.user;
    restriccion.peticion = "RESTRICCIONES_SUCURSALES";
    return this._http.post(this.urlPath,restriccion);
  }

  getRestricInstrumentos(restriccion: RestricInstrumentos){
    restriccion.userName = VARGLOBAL.user;
    restriccion.peticion = "RESTRICCIONES_INSTRUMENTOS";
    return this._http.post(this.urlPath,restriccion); 
  }
  
  insertRestriccion(restriccion: RestricInsert){
    restriccion.userName = VARGLOBAL.user;
    restriccion.peticion = "RESTRICCIONES_INSERT";
    return this._http.post(this.urlPath,restriccion);
  }

  deleteRestriccion(restriccion: RestricDelete){
    restriccion.userName = VARGLOBAL.user;
    restriccion.peticion = "RESTRICCIONES_DELETE";
    return this._http.post(this.urlPath,restriccion);
  }
}