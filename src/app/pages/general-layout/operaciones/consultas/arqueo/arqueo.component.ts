import {Component, OnInit} from '@angular/core';
import {ArqueoService} from './arqueo.service';
import swal from 'sweetalert2';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-arqueo',
  templateUrl: './arqueo.component.html'
})
export class ArqueoComponent implements OnInit {

  arqueoData = [];
  sucursales = [];
  empresas = [];

  constructor(
    private arqueoService: ArqueoService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['fi'] != null && params['fi'] !== 'undefined') {
        $('.page-loading').css({'z-index': '999', 'opacity': '1'});
        const filterArq = JSON.parse(params['fi']);
        this.getArqueo(filterArq);
      } else {
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    });
  }

  getArqueo(filterArq) {
    this.arqueoService.getArqueo(filterArq).subscribe((response: any) => {
      if (response.code !== 0) {
        console.log(response);
        this.arqueoData = response.arqueo;
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      } else {
        swal('Arqueo', response.description + '. Verifique Servidor Netswitch', 'error');
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    }, error => {
      $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      console.log(error);
    });
  }

  /** (MS) - Cambia las comas por puntos de las columnas tipo fecha
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorTurno(cellInfo) {
    const removeString = cellInfo.valueText.replace(/T/g, ' ');
    return removeString.replace(/-03:00/g, '');
  }

  /** (MS) - Cambia las comas por puntos de las columnas tipo currency
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparing(cellInfo) {
    const montoPositivo = cellInfo.valueText.replace(/-/g, '');
    return montoPositivo.replace(/,/g, '.');
  }

  calculateTotal(options) {

    if (options.name === 'Recaudado') {
      switch (options.summaryProcess) {
        case 'start':
          options.totalValue = 0;
          break;
        case 'calculate':
          if (options.value.tipo === 'TOTAL') {
            options.totalValue = options.totalValue + options.value.monto;
          }
          break;
      }
    }
  }
}
