import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GLOBAL_PATH } from '../../pages-services/global';
import { VARGLOBAL } from '../../../services/login-pass.service';
import {CuentasSelect, VoucherSelect, EditarCuentas, CrearCuentas, MediosPago,CuentaContableActiva,InstrumentoNoPago, CCIDelete, CCIInsert, CCISelect, VoucherExport} from '../cuentas-contables/model-cuentasContables';


@Injectable()
export class CuentaContableService {
  urlPath = GLOBAL_PATH.getPath;
  
  constructor(
    public _http: HttpClient
  ) {}

    //Aquí empieza el contenido
    /*  getTipoMoneda(tipoCambioGet: ListaMoneda) {
    tipoCambioGet.userName=VARGLOBAL.user;
    tipoCambioGet.peticion='LISTASITEM_SELECT';
    tipoCambioGet.adm = "1";
    tipoCambioGet.lista = "MONEDA"
    return this._http.post(this.urlPath,tipoCambioGet);
  }*/

  getVoucher(voucher: VoucherSelect){
    voucher.userName=VARGLOBAL.user;
    voucher.peticion = 'VOUCHER_SELECT';
    return this._http.post(this.urlPath,voucher);
  }
  getExportVoucher(exportt: VoucherExport){
    exportt.userName=VARGLOBAL.user;
    exportt.peticion = 'EXPORT_VOUECHER';
    return this._http.post(this.urlPath,exportt);
  }

  getCuentas(cuentas: CuentasSelect){
    cuentas.userName=VARGLOBAL.user;
    cuentas.peticion = 'CUENTAS_CONTABLES_SELECT';
    return this._http.post(this.urlPath,cuentas);
  }

  getEditarCuenta(editar: EditarCuentas){
    editar.userName=VARGLOBAL.user;
    editar.peticion = 'CUENTAS_CONTABLES_UPDATE';
    return this._http.post(this.urlPath,editar);
  }

  getCrearCuenta(crear: CrearCuentas){
    crear.userName=VARGLOBAL.user;
    crear.peticion = 'CUENTAS_CONTABLES_INSERT';
    return this._http.post(this.urlPath,crear);
  }

  /* Servicios para Selects */

  getInstrumentoNoPago(ins: InstrumentoNoPago){
    ins.userName=VARGLOBAL.user;
    ins.peticion = 'INSTRUMENTO_NO_PAGO_SELECT';
    return this._http.post(this.urlPath,ins);
  }

  getMediosPago(med: MediosPago){
    med.userName=VARGLOBAL.user;
    med.peticion = 'MEDIOS_PAGO_SELECT';
    return this._http.post(this.urlPath,med);
  }

  getCuentaActiva(cuact: CuentaContableActiva){
    cuact.userName=VARGLOBAL.user;
    cuact.peticion = 'CUENTA_CONTABLE_ACTIVA_SELECT';
    return this._http.post(this.urlPath,cuact);
  }
  /* Fin servicios Select */

/* COMIENZO SERVICIOS CCI */

  getCCISelect(sel: CCISelect){
    sel.userName=VARGLOBAL.user;
    sel.peticion = 'CCI_SELECT';
    return this._http.post(this.urlPath,sel);
  }

  getCCIDelete(del: CCIDelete){
    del.userName=VARGLOBAL.user;
    del.peticion = 'CCI_DELETE';
    return this._http.post(this.urlPath,del);
  }

  getCCIInsert(insc: CCIInsert){
    insc.userName=VARGLOBAL.user;
    insc.peticion = 'CCI_INSERT';
    return this._http.post(this.urlPath,insc);
  }
  /* Fin servicios CCI */

}