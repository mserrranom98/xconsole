import { Injectable } from '@angular/core';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';

@Injectable({
  providedIn: 'root'
})
export class ReglasService {

  private urlPath = GLOBAL_PATH.getPath;
  constructor(
    public _http: HttpClient
  ) {}

  getReglas() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'REGLASUAF_SELECT_FINAL'
    };
    return this._http.post(this.urlPath, body);
  }

  removeRegla(id) {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'REGLASUAF_DELETE',
      id: id
    };

    return this._http.post(this.urlPath, body);
  }

  addRegla(regla) {
    regla.userName = VARGLOBAL.user;
    regla.peticion = 'REGLASUAF_INSERT';

    return this._http.post(this.urlPath, regla);
  }
}
