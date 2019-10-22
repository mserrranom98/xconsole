import { Injectable } from '@angular/core';
import {VARGLOBAL} from '../../../services/login-pass.service';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  urlPath = GLOBAL_PATH.getPath;

  constructor(
    public _http: HttpClient
  ) {}

  getEmpEps() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'UTILS_EPSGET'
    };
    return this._http.post(this.urlPath, body);
  }

  getRex() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'REXS_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }
}
