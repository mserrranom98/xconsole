import { Component, OnInit } from '@angular/core';
import {AlarmasService} from '../../../shared/services/alarmas/alarmas.service';
import {ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-alarma',
  templateUrl: './alarma.component.html'
})
export class AlarmaComponent implements OnInit {

  alarmas = [];

  fechaIni: any;
  noDataText = 'No hay datos que mostrar';

  constructor(
    private route: ActivatedRoute,
    private alarmasService: AlarmasService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['fi'] != null && params['fi'] !== 'undefined') {
        const filterAla = JSON.parse(params['fi']);
        this.getAlarmas(filterAla);
      } else {
        const filterAla = [{
          fechaini: ' ',
          fechafin: ' ',
          tipo: ' ',
          empresa: ' ',
          estado: ' ',
          userName: '',
          peticion: ''
        }];
        this.getAlarmas(filterAla[0]);
      }
    });
  }

  getAlarmas(filter) {
    this.alarmasService.getAlarmas(filter).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Alarmas UAF', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
        $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
      } else {
        this.alarmas = response.alarmasuaf;
        $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
      }
    }, error => {
      console.log(error);
    });
  }

  /** (MS) - Cambia los nombres de los estados segun su codigo
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparingEstado(cellInfo) {

    switch (cellInfo.value) {
      case 'NENVIADO':
        return 'No enviado';
        break;
      case 'ENVIADO':
        return 'Enviado';
        break;
      case 'ERROR':
        return 'Error de envio';
        break;
      default:
        return 'Sin definir';
    }

  }

}
