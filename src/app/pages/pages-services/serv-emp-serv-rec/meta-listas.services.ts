import { Injectable } from "@angular/core";
//import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
//import * as cors from "cors";
import { VARGLOBAL } from "../../../services/login-pass.service";
import { MetaListaSelect, MetaListaInsert, MetaListaDelete, MetaListaItemSelect, MetaListaItemSet } from "../../pages-models/model-emp-serv-rec";
import { GLOBAL_PATH } from "../global";

@Injectable()
export class MetaListasService {
  urlPath = GLOBAL_PATH.getPath;
/*  options_cors: cors.CorsOptions = {
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

  getMetaListas(metaLista: MetaListaSelect) {
    metaLista.userName = VARGLOBAL.user;
    metaLista.peticion = "METALISTAS_SELECT";
    return this._http.post(this.urlPath, metaLista);
  }

  insertMetaLista(metaLista: MetaListaInsert) {
    metaLista.userName = VARGLOBAL.user;
    metaLista.peticion = "METALISTAS_INSERT";
    return this._http.post(this.urlPath, metaLista);
  }

  deleteMetaLista(metaLista: MetaListaDelete) {
    metaLista.userName = VARGLOBAL.user;
    metaLista.peticion = "METALISTAS_DELETE";
    return this._http.post(this.urlPath, metaLista);
  }

  getMetaListaItem(metaListaItem: MetaListaItemSelect) {
    metaListaItem.userName = VARGLOBAL.user;
    metaListaItem.peticion = "METALISTASITEM_SELECT";
    return this._http.post(this.urlPath, metaListaItem);
  }

  setMetaListaItem(metaListaItem: MetaListaItemSet) {
    metaListaItem.userName = VARGLOBAL.user;
    metaListaItem.peticion = "METALISTASITEM_SET";
    return this._http.post(this.urlPath, metaListaItem);
  }
}