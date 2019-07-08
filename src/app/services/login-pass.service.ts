import { Injectable } from '@angular/core';
//import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Login, Logout, ChangePass, Session } from '../models/usuario';
import { GLOBAL } from './global';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import * as cors from "cors";

@Injectable()
export class LoginPassService {

  public url: string;
  public urlLogout: string;
  public urlAction: string;
  urlSession = GLOBAL.getSession;

  data: Array<any> = [];
  public _dataSource = new BehaviorSubject<Array<any>>([]);
  dataSource$ = this._dataSource.asObservable();

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.doLogin;
    this.urlLogout = GLOBAL.doLogout;
    this.urlAction = GLOBAL.getAction;
    
  }

public setData(data: Array<any>) {
   this.data = data;
   this._dataSource.next(data);
}

  // Consulta de Usuario - Login
  cosultar(usuario: Login) {
    return this._http.post(this.url,usuario);
  }

  // Logout
  doLogout(usuario: Logout) {
    return this._http.post(this.urlLogout,usuario);
  }

  // Change Password
  doUpdateUserPassword(pass: ChangePass) {
    return this._http.post(this.urlAction,pass);
  }

  doSession(ses: Session) {
    return this._http.post(this.urlSession,ses);
  }

}

  export let VARGLOBAL = {
    userToken: '',
    sessionUUID: '',
    jsessionID: '',
    perfil: '',
    user: '',
    directory: ''
};
