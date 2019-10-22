import { Injectable } from '@angular/core';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';

@Injectable({
  providedIn: 'root'
})
export class AlarmasService {

  private urlPath = GLOBAL_PATH.getPath;
  constructor(
    public _http: HttpClient
  ) {}

  getAlarmas(filtro) {
    filtro.userName = VARGLOBAL.user;
    filtro.peticion = 'ALARMASUAF_SELECT';

    return this._http.post(this.urlPath, filtro);
  }

  getEstados() {
    return [
      {
        codigo: 'NENVIADO',
        titulo: 'No enviado'
      },
      {
        codigo: 'ENVIADO',
        titulo: 'Enviado'
      },
      {
        codigo: 'ERROR',
        titulo: 'Error'
      }
    ];
  }

}
