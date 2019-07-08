import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { TurnosSelect, TurnosMontosSelect, TurnosDetSelect } from '../../pages-models/model-general';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class TurnosService {
  urlPath = GLOBAL_PATH.getPath;
  /*options_cors:cors.CorsOptions = {
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

  getTurnos(turno: TurnosSelect) {
    turno.userName = VARGLOBAL.user;
    turno.peticion = "TURNOS_LEVEL1";
    return this._http.post(this.urlPath,turno);
  }

  getTurnosDetalle(turnoDetalle: TurnosDetSelect) {
    turnoDetalle.userName = VARGLOBAL.user;
    turnoDetalle.peticion = "TURNOS_LEVEL2";
    return this._http.post(this.urlPath,turnoDetalle);
  }

  getTurnosMontos(turnoMonto: TurnosMontosSelect) {
    turnoMonto.userName = VARGLOBAL.user;
    turnoMonto.peticion = "TURNOS_MONTOS";
    return this._http.post(this.urlPath,turnoMonto);
  }

}
