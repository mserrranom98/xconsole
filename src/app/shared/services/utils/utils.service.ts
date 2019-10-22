import { Injectable } from '@angular/core';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';

@Injectable()
export class UtilsService {
  urlPath = GLOBAL_PATH.getPath;

  constructor(
    public _http: HttpClient
  ) {
  }

  // Medio de Pago
  getMedioPago() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'UTILS_MEDIOSPAGOGET'
    };
    return this._http.post(this.urlPath, body);
  }

  // Instrumentos y Medios de Pago
  getInstrumentos() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'UTILS_INSTRUMENTOSGET'
    };
    return this._http.post(this.urlPath, body);
  }

  // Empresas EPS
  getEmpEps() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'UTILS_EPSGET'
    };
    return this._http.post(this.urlPath, body);
  }
}
