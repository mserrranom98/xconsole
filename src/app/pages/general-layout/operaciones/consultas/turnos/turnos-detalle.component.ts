import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TurnosDetSelect, DatosTurno, OprLevelII } from '../../../../pages-models/model-general';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TurnosService } from '../../../../pages-services/serv-general/turnos.service';
import { Router } from '@angular/router';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-turnos-detalle',
  templateUrl: './turnos-detalle.component.html',
  styles: []
})
export class TurnosDetalleComponent implements OnInit {
  turnosDetSelect: TurnosDetSelect;
  oprLevelII: OprLevelII;
  closeResult: string;
  pagina = 'turnos';
  divEnabledDetOper = false;

  @Input() datos: DatosTurno;
  @Input() fechaDesde: string;
  @Input() fechaHasta: string;
  @Input() rex: string;
  @Input() sucursal: string;
  @Input() rexDesc: string;
  @Input() sucDesc: string;

  @ViewChild(DatatableComponent) tabDet: DatatableComponent;
  data = [];
  rows: any[] = [];
  columns = [];
  temp = [];
  opc = new Object();
  divList = false;
  msj = '';

  constructor(
    private turnosService: TurnosService,
    private router: Router
  ) {
    this.turnosDetSelect = new TurnosDetSelect('', '', '', '');
    this.datos = new DatosTurno('', '', '', '', '', '', '', '', '');
    this.oprLevelII = new OprLevelII('', '', '', '', '');
  }

  ngOnInit() {
    this.data = [];
    this.turnosDetSelect.usuario = this.datos[0].usuario;
    this.turnosDetSelect.turno = this.datos[0].turno;
    this.turnosService.getTurnosDetalle(this.turnosDetSelect).subscribe(
      (response:any) => {
        const dir = response.rowCount;
        if (dir > 0) {
          this.divList = true;
          this.data = response.rows;
          this.rows = this.data;
          this.temp = this.data;
        } else {
          this.msj = 'No hay resultados';
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  onVolver() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/general/operaciones/consultas/turnos', JSON.stringify(this.fechaDesde), JSON.stringify(this.fechaHasta), 
        this.rex, this.rexDesc, this.sucursal, this.sucDesc]));
  }

  openDetail(rowIndex) {
    this.oprLevelII.operacion = this.rows[rowIndex].operacion;
    this.oprLevelII.turno = this.datos[0].turno;
    this.oprLevelII.usuario = this.datos[0].usuario;
    this.divEnabledDetOper = true;
  }

  // This function is used in open
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
