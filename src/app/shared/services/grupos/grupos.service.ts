import { Injectable } from '@angular/core';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private urlPath = GLOBAL_PATH.getPath;
  constructor(
    private _http: HttpClient
  ) {}

  getGrupos(estado: String) {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'GRUPOMAIL_SELECT',
      estado: estado
    };
    return this._http.post(this.urlPath, body);
  }

  updateGrupo(grupo) {
    grupo.userName = VARGLOBAL.user;
    grupo.peticion = 'GRUPOMAIL_UPDATE';

    return this._http.post(this.urlPath, grupo);
  }

  addGrupo(grupo) {
    grupo.userName = VARGLOBAL.user;
    grupo.peticion = 'GRUPOMAIL_INSERT';

    return this._http.post(this.urlPath, grupo);
  }

  getGruposIntegrantes() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'GRUPOSCONINTEGRANTES_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }
}
