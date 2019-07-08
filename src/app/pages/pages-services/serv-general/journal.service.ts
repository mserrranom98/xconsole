import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { JournalSelect } from '../../pages-models/model-general';
import { VARGLOBAL } from '../../../services/login-pass.service';
//import * as cors from "cors";
import { GLOBAL_PATH } from '../global';

@Injectable()
export class JournalService {
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

  getJournal(jou: JournalSelect) {
    jou.userName = VARGLOBAL.user;
    jou.peticion = "JOURNAL_SELECT";
    return this._http.post(this.urlPath,jou);
  }

}
