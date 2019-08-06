import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GLOBAL_PATH } from '../../pages-services/global';
import { VARGLOBAL } from '../../../services/login-pass.service';
import {EditarCuentas, CrearCuentas, CCIInsert, VoucherExport} from './model-cuentasContables';


@Injectable()
export class CuentaContableService {

  private urlPath = GLOBAL_PATH.getPath;
  constructor(
    public _http: HttpClient
  ) {}

  getVoucher(fecha: String) {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'VOUCHER_SELECT',
      fechacons: fecha
    };
    return this._http.post(this.urlPath, body);
  }

  getExportVoucher(exportt: VoucherExport) {
    exportt.userName = VARGLOBAL.user;
    exportt.peticion = 'EXPORT_VOUECHER';
    return this._http.post(this.urlPath, exportt);
  }

  getCuentas(acctivo: String) {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'CUENTAS_CONTABLES_SELECT',
      activo: acctivo
    };
    return this._http.post(this.urlPath, body);
  }

  getEditarCuenta(editar: EditarCuentas) {
    editar.userName = VARGLOBAL.user;
    editar.peticion = 'CUENTAS_CONTABLES_UPDATE';
    return this._http.post(this.urlPath, editar);
  }

  getCrearCuenta(crear: CrearCuentas) {
    crear.userName = VARGLOBAL.user;
    crear.peticion = 'CUENTAS_CONTABLES_INSERT';
    return this._http.post(this.urlPath, crear);
  }

  /* Servicios para Selects */

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

  getCuentaActiva() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'CUENTA_CONTABLE_ACTIVA_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }
  /* Fin servicios Select */

  /* COMIENZO SERVICIOS CCI */

  getCCISelect() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'CCI_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

  getCCIDelete(cciDelete) {
    cciDelete.userName = VARGLOBAL.user;
    cciDelete.peticion = 'CCI_DELETE';
    console.log(cciDelete);
    return this._http.post(this.urlPath, cciDelete);
  }

  getCCIInsert(insc: CCIInsert) {
    insc.userName = VARGLOBAL.user;
    insc.peticion = 'CCI_INSERT';
    return this._http.post(this.urlPath, insc);
  }
  /* Fin servicios CCI */
}
