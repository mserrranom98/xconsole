import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TerIU, TerDelete } from '../../pages-models/model-emp-rec';
import { VARGLOBAL } from '../../../services/login-pass.service';
import { GLOBAL_PATH } from '../global';

@Injectable()
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
