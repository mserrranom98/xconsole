import { Injectable } from '@angular/core';
//import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Listas, ListaIU, LDelete, ListasItems, LItemIU, LItemDelete } from '../../pages-models/model-emp-serv-rec';
//import * as cors from "cors";
import { VARGLOBAL } from '../../../services/login-pass.service';
import { GLOBAL_PATH } from '../global';

@Injectable()
export class ListasService {
  
  urlPath = GLOBAL_PATH.getPath;
  
 /* options_cors: cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: false,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: '*',
    preflightContinue: false
  };
*/

  constructor(
    public _http: HttpClient
  ) { }

  // Consultar Listas
  getListas(lista: Listas) {
    lista.peticion = "LISTAS_SELECT";
    lista.userName = VARGLOBAL.user;
    return this._http.post(this.urlPath, lista);
  }

  // Insert Listas
  insertListas(lista: ListaIU) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = "LISTAS_INSERT";
    return this._http.post(this.urlPath, lista);
  }

  // Update Listas
  updateListas(lista: ListaIU) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = "LISTAS_UPDATE";
    return this._http.post(this.urlPath, lista);
  }

  // Delete Listas
  deleteListas(lista: LDelete) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = "LISTAS_DELETE";
    return this._http.post(this.urlPath, lista);
  }

  // Consultar Listas Detalle
  getListasDet(lista: ListasItems) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = "LISTASITEM_SELECT";
    return this._http.post(this.urlPath, lista);
  }

  // Insert Listas Detalle
  insertLDet(lista: LItemIU) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = "LISTASITEM_INSERT";
    return this._http.post(this.urlPath, lista);
  }
  // Update Listas Detalle
  updateLDet(lista: LItemIU) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = "LISTASITEM_UPDATE";
    return this._http.post(this.urlPath, lista);
  }
  // Delete Listas Detalle
  deleteLDet(lista: LItemDelete) {
    lista.userName = VARGLOBAL.user;
    lista.peticion = "LISTASITEM_DELETE";
    return this._http.post(this.urlPath, lista);
  }
}
