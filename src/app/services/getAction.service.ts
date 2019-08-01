import { Injectable } from '@angular/core';

import { GLOBAL } from './global';
import {
  GetActionTables, GetActionInsert, GetActionUpdate, GetActionFeatures, GetTablesUnion,
  DropTablesUnion, GenPass, GetFeatures, Pass, GetActionSection, GetMenuPages, GetUpdateSection, IUPrfpages
} from '../models/desktop';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, timeout} from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable()
export class GetActionService {
  public url: string;
  public urlDir = GLOBAL.getDirectories;
  
  /*options_cors:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: '*',
    preflightContinue: false
  };*/
  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.getAction;

  }

  // Consultar Páginas
  tables(table: GetActionTables) {
    return this._http.post(this.url, table);
  }

  // Consultar Features
  list(table: GetFeatures) {
    return this._http.post(this.url, table);
  }

  // Consultar Features-Pages
  listFeatures(table: GetActionFeatures) {
    return this._http.post(this.url, table);
  }

  // Insert
  doInsert(data: GetActionInsert) {
    return this._http.post(this.url, data);
  }

  // Update
  doUpdate(data: GetActionUpdate) {
    return this._http.post(this.url, data);
  }

  // Consultar Tables Union
  tablesUnion(table: GetTablesUnion) {
    return this._http.post(this.url, table);
  }

  // Delete Tables Union
  dropTablesUnion(table: DropTablesUnion) {
    return this._http.post(this.url, table);
  }

  // Generar Password
  generatePass(user: GenPass) {
    return this._http.post(this.url, user);
  }

  // GeT Password
  geTPass(user: Pass) {
    return this._http.post(this.url, user);
  }

  // Lista de Directorios Login
  getDirectories() {
     return this._http.post(this.urlDir, {}).pipe(
         timeout(5000),
         catchError(this.handleError)
     );
  }

  // Consulta Section
  conSection(sec: GetActionSection) {
    return this._http.post(this.url, sec);
  }

  // Update Section
  updateSection(sec: GetUpdateSection) {
    return this._http.post(this.url, sec);
  }

  // Consultar Páginas
  menuPages(table: GetMenuPages) {
    return this._http.post(this.url, table);
  }

  // Actualizar Profile Pages
  actPrfPag(prfPag: IUPrfpages) {
    return this._http.post(this.url, prfPag);
  }

  private handleError(error: HttpErrorResponse) {
    swal('Error de acceso', 'Nose pudo conectar con el XPortal, por favor contactarse con el Administrador, error :\n' + error.message, 'error');
    $('#loading').css('display', 'none');
    return throwError(error.message);
  };
}
