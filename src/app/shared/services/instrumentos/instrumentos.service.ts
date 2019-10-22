import { Injectable } from '@angular/core';
import {VARGLOBAL} from '../../../services/login-pass.service';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstrumentosService {

  private urlPath = GLOBAL_PATH.getPath;
  constructor(
    public _http: HttpClient
  ) {}

  getInstrumentoNoPago() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'INSTRUMENTO_NO_PAGO_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

  getMediosPago() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'MEDIOS_PAGO_SELECT'
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

  // Instrumentos por empresaEPS
  getInstrumentosEPS(empresa) {
    const body = {
      eps: empresa,
      userName: VARGLOBAL.user,
      peticion: 'UTILS_INSTRUMENTOS_EPS_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

  getInstrumentosFull(instrumentosFull) {
    instrumentosFull.peticion = 'INSTRUMENTOS_FULL';
    instrumentosFull.userName = VARGLOBAL.user;
    return this._http.post(this.urlPath, instrumentosFull);
  }

  getTipoIndustria() {
    const body = {
      peticion: 'INSTRUMENTOS_LEVEL1',
      userName: VARGLOBAL.user
    };
    return this._http.post(this.urlPath, body);
  }

  getIndustria(tipo) {
    const body = {
      peticion: 'INSTRUMENTOS_LEVEL2',
      userName: VARGLOBAL.user,
      codigo: tipo
    };
    return this._http.post(this.urlPath, body);
  }

  getEmpresa(industria) {
    const body = {
      peticion: 'INSTRUMENTOS_LEVEL3',
      userName: VARGLOBAL.user,
      codigo: industria
    };
    return this._http.post(this.urlPath, body);
  }

  getAtributo(instrumentosFull) {
    instrumentosFull.peticion = 'INSTRUMENTOS_ATRIBUTOS1';
    instrumentosFull.userName = VARGLOBAL.user;
    console.log(JSON.stringify(instrumentosFull));
    return this._http.post(this.urlPath, instrumentosFull);
  }

  /* Editar Instrumento */

  getEditInstrumento(instrumentosEdit) {
    instrumentosEdit.peticion = 'INSTRUMENTOS_FULL_UPDATE';
    instrumentosEdit.userName = VARGLOBAL.user;
    console.log(JSON.stringify(instrumentosEdit));
    return this._http.post(this.urlPath, instrumentosEdit);
  }

  /* Editar Atributo */

  getEditAtributo(atribEdit) {
    atribEdit.peticion = 'INSTRUMENTOS_ATRIBUTOS1_UPDATE';
    atribEdit.userName = VARGLOBAL.user;
    console.log(JSON.stringify(atribEdit));
    return this._http.post(this.urlPath, atribEdit);
  }

}
