import { Component, OnInit } from '@angular/core';

import swal from 'sweetalert2';
import { CardinalidadSelect, CardinalidadDelete } from '../../../../pages-models/model-general';
import { CardinalidadmpService } from '../../../../pages-services/serv-general/cardinalidadmp.service';

@Component({
  selector: 'app-carnidalidadmp',
  templateUrl: './carnidalidadmp.component.html',
  styles: []
})
export class CarnidalidadmpComponent implements OnInit {
  cardinalidadSelect: CardinalidadSelect;
  cardinalidadDelete: CardinalidadDelete;
  rows = [];
  divList = false;
  msj = '';

  constructor(
    private cardinalidadmpService: CardinalidadmpService,
  ) {
    this.cardinalidadSelect = new CardinalidadSelect('', '');
    this.cardinalidadDelete = new CardinalidadDelete('', '', '');
   }

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    this.cardinalidadmpService.getCardinalidad(this.cardinalidadSelect).subscribe(
      (response:any) => {
        if (response.rowCount !== '0') {
          this.rows = response.rows;
          this.divList = true;
          $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
        } else {
          this.divList = false;
          this.msj = 'No hay resultados';
          $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
        }
      }
    )
  }

  onEliminar(rowIndex) {
    const obj = this.rows[rowIndex];
    this.cardinalidadDelete.regla = obj['regla'];
    swal({
      title: 'Advertencia!',
      type: 'warning',
      text: 'Eliminar Regla: ' + obj['regla'],
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.cardinalidadmpService.cardDelete(this.cardinalidadDelete).subscribe(
          (response:any) => {
            if (response.code === '0') {
              swal('Cardinalidad', 'Registro Eliminado', 'success');
              this.buscar();
            } else {
              swal('Cardinalidad', response.description, 'error');
            }
          },
          error => {
            console.log(<any>error);
          });
      } else {
        swal('Cardinalidad', 'Registro No ha sido Eliminado', 'warning');
      }
    });
  }

}
