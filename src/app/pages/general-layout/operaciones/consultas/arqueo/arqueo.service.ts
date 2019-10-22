import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GLOBAL_PATH } from '../../../../pages-services/global';
import {VARGLOBAL} from '../../../../../services/login-pass.service';


@Injectable()
export class ArqueoService {

  urlPath = GLOBAL_PATH.getPath;
  /*prueba = [
    {
      usuario: 'MSERRANO',
      turno: '2019-09-25 15:29:54',
      empresa: [

      ]
    },
  ];*/

  constructor(
    public _http: HttpClient
  ) {}

  getArqueo(arqueo) {
    arqueo.userName = VARGLOBAL.user;
    arqueo.peticion = 'ARQUEO_SELECT';
    return this._http.post(this.urlPath, arqueo);
  }

}
