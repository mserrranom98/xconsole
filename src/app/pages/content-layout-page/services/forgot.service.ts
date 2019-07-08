import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ChangePass } from '../models/usuario';
import { ForgotPass } from '../../../models/desktop';
import { GLOBAL } from '../../../services/global';


@Injectable()
export class ForgotService {

  public url: string;
  public urlPass: string;

  constructor(
    public _http: Http
  ) {
    this.url = GLOBAL.getAction;
    this.urlPass = GLOBAL.doPassword;
  }

  getUrl() {
    return this.url;
  }

  change(usuario: ChangePass) {
    const json = JSON.stringify(usuario);
    const headers = new Headers({
      'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });
    const options = new RequestOptions({ headers: headers });
    return this._http.post(this.url, json, options).map(res => res.json());
  }

  forgot(usuario: ForgotPass) {
    const json = JSON.stringify(usuario);
    const headers = new Headers({
      'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });
    const options = new RequestOptions({ headers: headers });
    return this._http.post(this.urlPass, json, options).map(res => res.json());
  }

}
