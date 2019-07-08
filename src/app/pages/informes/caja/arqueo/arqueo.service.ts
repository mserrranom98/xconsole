import { Injectable } from '@angular/core';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../../../pages-services/global';
import { ArqueoSelect, ExportArqueo } from './model-arqueo';


@Injectable()
export class ArqueoService {
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

  getArqueo(arqueo: ArqueoSelect) {   
    return this._http.post(this.urlPath,arqueo);
  }
  getArqueoFull(arqueoFull: ExportArqueo) {   
    return this._http.post(this.urlPath,arqueoFull);
  }

}
