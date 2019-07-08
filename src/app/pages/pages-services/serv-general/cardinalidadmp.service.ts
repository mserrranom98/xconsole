import { Injectable } from '@angular/core';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { CardinalidadSelect, CardinalidadI, CardinalidadDelete } from '../../pages-models/model-general';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class CardinalidadmpService {
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

  // Consulta de Cardinalidad
  getCardinalidad(card: CardinalidadSelect) {
    card.userName = VARGLOBAL.user;
    card.peticion = "CARDINALIDAD_SELECT";
    return this._http.post(this.urlPath,card);
  }

  // Insert Cardinalidad
  cardInsert(card: CardinalidadI) {
    card.userName = VARGLOBAL.user;
    card.peticion = "CARDINALIDAD_INSERT";
    return this._http.post(this.urlPath,card);
  }

  // Delete Cardinalidad
  cardDelete(card: CardinalidadDelete) {
    card.userName = VARGLOBAL.user;
    card.peticion = "CARDINALIDAD_DELETE";
    return this._http.post(this.urlPath,card);
  }
}
