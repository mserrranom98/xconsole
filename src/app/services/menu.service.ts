import { Injectable } from '@angular/core';
//import {Http, Response, Headers, RequestOptions} from '@angular/http';
// import { GLOBAL } from 'app/services/global';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { PageMenu } from '../models/usuario';
import { GLOBAL } from './global';


@Injectable()
export class MenuService {
  public url: string;

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.getAction;
   }

   getUrl() {
    return this.url;
  }

  // Consultar Páginas
  cosultar(con: PageMenu) {
   

        return this._http.post(this.url, con);
    }
}
