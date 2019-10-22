import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GLOBAL_PATH} from '../../../../pages-services/global';
import {
  ObtenerTipoCambio,
  CrearTipoCambio,
  ActualizarTipoCambio,
  BorrarTipoCambio,
  ListaMoneda,
  CargaMasivaTipoCambio
} from './tipocambio.model';
import {VARGLOBAL} from '../../../../../services/login-pass.service';


@Injectable()
export class TipoCambioService {
  urlPath = GLOBAL_PATH.getPath;

  constructor(
    public _http: HttpClient
  ) {
  }

  getTipoMoneda(tipoCambioGet: ListaMoneda) {
    tipoCambioGet.userName = VARGLOBAL.user;
    tipoCambioGet.peticion = 'LISTASITEM_SELECT';
    tipoCambioGet.adm = '1';
    tipoCambioGet.lista = 'MONEDA'
    return this._http.post(this.urlPath, tipoCambioGet);
  }

  getTipoCAmbio(tipoCambioGet: ObtenerTipoCambio) {
    tipoCambioGet.peticion = 'TIPOCAMBIO_SELECT';
    tipoCambioGet.userName = VARGLOBAL.user;
    return this._http.post(this.urlPath, tipoCambioGet);
  }

  postTipoCAmbio(tipoCambioPost: CrearTipoCambio) {
    tipoCambioPost.peticion = 'TIPOCAMBIO_INSERT';
    tipoCambioPost.userName = VARGLOBAL.user;
    return this._http.post(this.urlPath, tipoCambioPost);
  }

  putTipoCAmbio(arqueoUpd: ActualizarTipoCambio) {
    arqueoUpd.peticion = 'TIPOCAMBIO_UPDATE';
    arqueoUpd.userName = VARGLOBAL.user;
    return this._http.post(this.urlPath, arqueoUpd);
  }

  deleteTipoCAmbio(arqueoDel: BorrarTipoCambio) {
    arqueoDel.peticion = 'TIPOCAMBIO_DELETE';
    arqueoDel.userName = VARGLOBAL.user;
    return this._http.post(this.urlPath, arqueoDel);
  }

  getIndicadores() {
    return this._http.get('https://mindicador.cl/api', {});
  }

  postArchivo(cargaMasiva: CargaMasivaTipoCambio) {
    cargaMasiva.peticion = 'TIPOCAMBIO_CARGA';
    cargaMasiva.userName = VARGLOBAL.user;
    return this._http.post(this.urlPath, cargaMasiva);
  }
}
