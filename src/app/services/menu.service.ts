import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageMenu } from '../models/usuario';
import { GLOBAL } from './global';


@Injectable()
export class MenuService {
  public url: string;

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.getAction;
   }

   getUrl() {
    return this.url;
  }

  cosultar(con: PageMenu) {
    return this._http.post(this.url, con);
  }
}
