import { Injectable } from '@angular/core';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';
import {TerDelete, TerIU} from '../../../pages/pages-models/model-emp-rec';

@Injectable({
  providedIn: 'root'
})
export class TerminalesService {

  urlPath = GLOBAL_PATH.getPath;

  constructor(public _http: HttpClient
  ) {
  }

  getTer(sucursal: String) {
    const body = {
      sucursalList: sucursal,
      userName: VARGLOBAL.user,
      peticion: 'TERMINALES_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

  getTerList(sucursal: any[], rex: String) {
    const body = {
      rex: rex,
      sucursalList: sucursal,
      userName: VARGLOBAL.user,
      peticion: 'TERMINALES_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

  insertTer(ter: TerIU) {
    ter.userName = VARGLOBAL.user;
    ter.peticion = 'TERMINALES_INSERT';
    return this._http.post(this.urlPath, ter);
  }
  updateTer(ter: TerIU) {
    ter.userName = VARGLOBAL.user;
    ter.peticion = 'TERMINALES_UPDATE';
    return this._http.post(this.urlPath, ter);
  }

  deleteTer(ter: TerDelete) {
    ter.userName = VARGLOBAL.user;
    ter.peticion = 'TERMINALES_DELETE';
    return this._http.post(this.urlPath, ter);
  }

}
