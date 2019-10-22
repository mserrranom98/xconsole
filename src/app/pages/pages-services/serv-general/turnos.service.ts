import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';
import {GLOBAL_PATH} from '../global';

@Injectable()
export class TurnosService {

  urlPath = GLOBAL_PATH.getPath;

  constructor(
    public _http: HttpClient
  ) {
  }

  getTurnos(turno) {
    turno.userName = VARGLOBAL.user;
    turno.peticion = 'TURNOS_FIN';
    return this._http.post(this.urlPath, turno);
  }

  getTurnosDetalle(turnoDetalle) {
    turnoDetalle.userName = VARGLOBAL.user;
    turnoDetalle.peticion = 'TURNOS_LEVEL2';
    return this._http.post(this.urlPath, turnoDetalle);
  }

}
