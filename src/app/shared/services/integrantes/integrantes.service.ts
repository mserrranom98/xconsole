import { Injectable } from '@angular/core';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';

@Injectable({
  providedIn: 'root'
})
export class IntegrantesService {

  private urlPath = GLOBAL_PATH.getPath;
  constructor(
    public _http: HttpClient
  ) {}

  getIntegrantes(estado: String) {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'GRUPOMAILINTEGRANTES_SELECT',
      estado: estado
    };
    return this._http.post(this.urlPath, body);
  }

  updateIntegrante(integrante) {
    integrante.userName = VARGLOBAL.user;
    integrante.peticion = 'GRUPOMAILINTEGRANTES_UPDATE';

    return this._http.post(this.urlPath, integrante);
  }

  addIntegrante(integrante) {
    integrante.userName = VARGLOBAL.user;
    integrante.peticion = 'GRUPOMAILINTEGRANTES_INSERT';

    return this._http.post(this.urlPath, integrante);
  }
}
