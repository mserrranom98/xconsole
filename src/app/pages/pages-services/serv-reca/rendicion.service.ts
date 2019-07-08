import { Injectable } from '@angular/core';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { RendicionSelect, RendicionInsert } from '../../pages-models/model-global';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class RendicionService {
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

  getRendicion(rendicion: RendicionSelect) {
    rendicion.userName = VARGLOBAL.user;
    rendicion.peticion = "RENDICION_SELECT";
    return this._http.post(this.urlPath,rendicion);
  }

  insertRendicion(rendicion: RendicionInsert) {
    rendicion.userName = VARGLOBAL.user;
    rendicion.peticion = "RENDICION_INSERT";
    return this._http.post(this.urlPath,rendicion);
  }
}
