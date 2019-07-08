import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { BitSelect, BitLevel1, BitLevel2 } from '../../pages-models/model-global';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class BitacoraService {
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
  ) {

  }

    // Consultar Filtro
    getBitacora(bit: BitSelect) {
      bit.userName = VARGLOBAL.user;
      bit.peticion = "BITACORA_FILTER";
      return this._http.post(this.urlPath,bit);
    }

    // Consultar Nivel I
    getNivel1(bit: BitLevel1) {
      bit.peticion = "BITACORA_LEVEL1";
      return this._http.post(this.urlPath,bit);
    }

    // Consultar Nivel II
    getNivel2(bit: BitLevel2) {
      bit.peticion = "BITACORA_LEVEL2";
      return this._http.post(this.urlPath,bit);
    }
}
