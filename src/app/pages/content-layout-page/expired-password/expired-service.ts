import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ChangePass } from './expired-user';
import { ForgotPass } from '../../../models/desktop';
import { GLOBAL } from '../../../services/global';


@Injectable()
export class ExpiredService {

  public url: string;
  public urlPass: string;

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.getExpPassEcubas;
    this.urlPass = GLOBAL.doPassword;
  }

  getUrl() {
    return this.url;
  }

  change(usuario: ChangePass) {       
    return this._http.post(this.url, usuario);
  } 

}
