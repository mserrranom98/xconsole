import { Injectable } from '@angular/core';
//import { Http, RequestOptions, Headers } from '@angular/http';
//import * as cors from "cors";
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { GLOBAL_PATH } from '../../../../pages/pages-services/global';
import {ListaInstrumento, ListaInstrumento2, ListaInstrumento3, ListaInstrumentoFull, EditarInstrumento, EditarAtributo} from './instrumentos.model';
import { VARGLOBAL } from '../../../../services/login-pass.service';


@Injectable()
export class InstrumentosService { 
  urlPath = GLOBAL_PATH.getPath;
/*  options_cors:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: false,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: '*',
    preflightContinue: false
  };  */
 
  constructor(
    public _http: HttpClient
  ) {}

  getInstrumentos(instrumentosFull: ListaInstrumentoFull) {
    instrumentosFull.peticion='INSTRUMENTOS_FULL';
    instrumentosFull.userName=VARGLOBAL.user;  
    return this._http.post(this.urlPath,instrumentosFull);
  }

  getTipoIndustria(instrumentosFull: ListaInstrumento) {
    instrumentosFull.peticion='INSTRUMENTOS_LEVEL1';
    instrumentosFull.userName=VARGLOBAL.user;    
    return this._http.post(this.urlPath,instrumentosFull);
  }

  getIndustria(instrumentosFull: ListaInstrumento) {
    instrumentosFull.peticion='INSTRUMENTOS_LEVEL2';
    instrumentosFull.userName=VARGLOBAL.user; 
    console.log(JSON.stringify(instrumentosFull)); 
    return this._http.post(this.urlPath,instrumentosFull);
  }

  getEmpresa(instrumentosFull: ListaInstrumento2) {
    instrumentosFull.peticion='INSTRUMENTOS_LEVEL3';
    instrumentosFull.userName=VARGLOBAL.user; 
    console.log(JSON.stringify(instrumentosFull)); 
    return this._http.post(this.urlPath,instrumentosFull);
  }
  
  getAtributo(instrumentosFull: ListaInstrumento3) {
    instrumentosFull.peticion='INSTRUMENTOS_ATRIBUTOS1';
    instrumentosFull.userName=VARGLOBAL.user; 
    console.log(JSON.stringify(instrumentosFull)); 
    return this._http.post(this.urlPath,instrumentosFull);
  }

  /* Editar Instrumento */

  getEditInstrumento(instrumentosEdit: EditarInstrumento) {
    instrumentosEdit.peticion='INSTRUMENTOS_FULL_UPDATE';
    instrumentosEdit.userName=VARGLOBAL.user; 
    console.log(JSON.stringify(instrumentosEdit)); 
    return this._http.post(this.urlPath,instrumentosEdit);
  }

    /* Editar Atributo */

    getEditAtributo(atribEdit: EditarAtributo) {
      atribEdit.peticion='INSTRUMENTOS_ATRIBUTOS1_UPDATE';
      atribEdit.userName=VARGLOBAL.user; 
      console.log(JSON.stringify(atribEdit)); 
      return this._http.post(this.urlPath,atribEdit);
    }

}