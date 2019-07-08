import { Injectable } from '@angular/core';
//import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { NotiSelect, NotiPick, NotiDone } from '../../pages-models/model-global';
//import { HttpClient } from '@angular/common/http';
import { GLOBAL_PATH } from '../global';

@Injectable()
export class NotificacionService {
  urlPath = GLOBAL_PATH.getPath;
  headers = {};
  constructor(
  //  public _http: Http,
    public _httpClient: HttpClient
  ) {
    this.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Accept, X-Requested-With',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*'
    };
  }

    // Consultar si hay notificaciones
    anyNoti(not: NotiSelect) {
      not.userName = 'RARCE';
      not.receiver = 'RBRAVO';
      const json = JSON.stringify(not);
      const httpOptions = { headers:new HttpHeaders({
        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      })
    }
//      const headers = new Headers(this.headers);
//      const options = new RequestOptions({ headers: headers });
      return this._httpClient.post(this.urlPath, json, httpOptions);
    }

    // Get Notificaciones de usuario
    getNoti(not: NotiSelect) {
      not.userName = 'RARCE';
      not.receiver = 'RBRAVO';
      const json = JSON.stringify(not);
      const httpOptions = { headers:new HttpHeaders({
        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      })
    }
//      const headers = new Headers(this.headers);
//      const options = new RequestOptions({ headers: headers });
      return this._httpClient.post(this.urlPath, json, httpOptions);
    }

    pickNoti(not: NotiPick) {
      not.userName = 'RARCE';
      not.receiver = 'RBRAVO';
      const json = JSON.stringify(not);
      const httpOptions = { headers:new HttpHeaders({
        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      })
    }
//      const headers = new Headers(this.headers);
//      const options = new RequestOptions({ headers: headers });
      return this._httpClient.post(this.urlPath , json, httpOptions);
    }

    doneNoti(not: NotiDone) {
      not.userName = 'RARCE';
      const json = JSON.stringify(not);
      const httpOptions = { headers:new HttpHeaders({
        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      })
    }
//      const headers = new Headers(this.headers);
//      const options = new RequestOptions({ headers: headers });
      return this._httpClient.post(this.urlPath, json, httpOptions );
    }
}
