import { Injectable } from '@angular/core';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSucursalService {

  urlPath = GLOBAL_PATH.getPath;

  constructor(public _http: HttpClient
  ) {
  }

  getUsuarios() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'USUARIO_SUCURSAL_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

  getUsuarioUserName() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'USUARIO_SUCURSAL_USERNAME_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

  addUsuario(usuario) {
    usuario.userName = VARGLOBAL.user,
    usuario.peticion = 'USUARIO_SUCURSAL_INSERT'
    return this._http.post(this.urlPath, usuario);
  }

  deleteUsuario(id) {
    const body = {
      id: id,
      userName: VARGLOBAL.user,
      peticion: 'USUARIO_SUCURSAL_DELETE'
    };
    return this._http.post(this.urlPath, body);
  }
}
