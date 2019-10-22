import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Listas, ListaIU, LDelete, LItemIU, LItemDelete} from '../../pages-models/model-emp-serv-rec';
import {VARGLOBAL} from '../../../services/login-pass.service';
import {GLOBAL_PATH} from '../global';

@Injectable()
export class ListasService {

  private urlPath = GLOBAL_PATH.getPath;

  constructor(
    public _http: HttpClient
  ) {
  }

  // Consultar Listas
  getListas(lista: Listas) {
    lista.peticion = 'LISTAS_SELECT';
    lista.userName = VARGLOBAL.user;
    return this._http.post(this.urlPath, lista);
  }

  // Insert Listas
  insertListas(lista: ListaIU) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = 'LISTAS_INSERT';
    return this._http.post(this.urlPath, lista);
  }

  // Update Listas
  updateListas(lista: ListaIU) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = 'LISTAS_UPDATE';
    return this._http.post(this.urlPath, lista);
  }

  // Delete Listas
  deleteListas(lista: LDelete) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = 'LISTAS_DELETE';
    return this._http.post(this.urlPath, lista);
  }

  // Consultar Listas Detalle
  getListasDet(lista: String) {
    const body = {
      lista: lista,
      userName: VARGLOBAL.user,
      peticion: 'LISTASITEM_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

  // Insert Listas Detalle
  insertLDet(lista: LItemIU) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = 'LISTASITEM_INSERT';
    return this._http.post(this.urlPath, lista);
  }

  // Update Listas Detalle
  updateLDet(lista: LItemIU) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = 'LISTASITEM_UPDATE';
    return this._http.post(this.urlPath, lista);
  }

  // Delete Listas Detalle
  deleteLDet(lista: LItemDelete) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = 'LISTASITEM_DELETE';
    return this._http.post(this.urlPath, lista);
  }
}
