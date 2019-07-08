import { Component, OnInit, Input } from '@angular/core';
import { OprLevelIII } from '../../../../pages-models/model-general';
import { OperacionesService } from '../../../../pages-services/serv-general/operaciones.service';


@Component({
  selector: 'app-detalle-ticket',
  templateUrl: './detalle-ticket.component.html',
  styles: []
})
export class DetalleTicketComponent implements OnInit {
  @Input() datos: OprLevelIII;
  rows = [];

  constructor(
    private operacionesService: OperacionesService
  ) {
    this.datos = new OprLevelIII('', '', '', '', '', '', '');
  }

  ngOnInit() {
    $('#loading').css('display', 'block');
    this.operacionesService.getOperacionesIII(this.datos).subscribe(
      (response:any) => {
        if (response.rowCount !== '0') {
          this.rows = response.rows;
        }
        $('#loading').css('display', 'none');
      }
    )
  }

}
