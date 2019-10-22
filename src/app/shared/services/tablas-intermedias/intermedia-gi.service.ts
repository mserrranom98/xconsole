import { Injectable } from '@angular/core';
import {GLOBAL_PATH} from '../../../pages/pages-services/global';
import {HttpClient} from '@angular/common/http';
import {VARGLOBAL} from '../../../services/login-pass.service';

@Injectable({
  providedIn: 'root'
})
export class IntermediaGIService {

  private urlPath = GLOBAL_PATH.getPath;
  constructor(
    public _http: HttpClient
  ) {}

  getIntermedia() {
    const body = {
      userName: VARGLOBAL.user,
      peticion: 'INTERMEDIA_GI_SELECT',
    };
    return this._http.post(this.urlPath, body);
  }

  removeIntermedia(intermedia) {
    intermedia.userName = VARGLOBAL.user;
    intermedia.peticion = 'INTERMEDIA_GI_DELETE';

    return this._http.post(this.urlPath, intermedia);
  }

  addIntermedia(intermedia) {
    intermedia.userName = VARGLOBAL.user;
    intermedia.peticion = 'INTERMEDIA_GI_INSERT';

    return this._http.post(this.urlPath, intermedia);
  }
}
