import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { TurnosAbiertosSelect, TurnosCierre } from '../../pages-models/model-global';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class CierreTurnoService {
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
 
  getTurnosAbiertos(turnoAbierto: TurnosAbiertosSelect) {
    turnoAbierto.userName = VARGLOBAL.user;
    turnoAbierto.peticion = "TURNOS_ABIERTOS";
    return this._http.post(this.urlPath,turnoAbierto);
  } 

  closeTurnos(turnoCierre: TurnosCierre) {
    turnoCierre.userName = VARGLOBAL.user;
    turnoCierre.peticion = "TURNOS_CERRAR";
    return this._http.post(this.urlPath,turnoCierre);
  } 
}