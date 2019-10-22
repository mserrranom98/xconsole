import { Injectable } from '@angular/core';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  urlPath = GLOBAL_PATH.getPath;

  constructor(public _http: HttpClient
  ) {}

  getSuc(rex: String) {
    const body = {
      rex: rex,
      userName: VARGLOBAL.user,
      peticion: 'SUCURSALES_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

}
