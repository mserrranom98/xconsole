import {Injectable} from '@angular/core';
//import { Http, Headers, RequestOptions } from '@angular/http';
import {HttpClient, HttpResponse, HttpHeaders, HttpRequest} from '@angular/common/http';
import {RexSelect, RexIU, RexDelete} from '../../pages-models/model-emp-rec';
import {VARGLOBAL} from '../../../services/login-pass.service';
//import * as cors from "cors";
import {GLOBAL_PATH} from '../global';

@Injectable()
export class EmpRexsService {
  urlPath = GLOBAL_PATH.getPath;

  /*  options_cors:cors.CorsOptions = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: false,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: '*',
      preflightContinue: false
    };
  */
  constructor(public _http: HttpClient
  ) {
  }

  getRex() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'REXS_SELECT'
    };
    return this._http.post(this.urlPath, body);
  }

  insertRex(rex: RexIU) {
    rex.userName = VARGLOBAL.user;
    rex.peticion = 'REXS_INSERT';
    return this._http.post(this.urlPath, rex);
  }

  updateRex(rex: RexIU) {
    rex.userName = VARGLOBAL.user;
    rex.peticion = 'REXS_UPDATE';
    return this._http.post(this.urlPath, rex);
  }

  deleteRex(rex: RexDelete) {
    rex.userName = VARGLOBAL.user;
    rex.peticion = 'REXS_DELETE';
    return this._http.post(this.urlPath, rex);
  }

}
