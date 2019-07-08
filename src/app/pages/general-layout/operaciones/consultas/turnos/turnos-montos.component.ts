import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TurnosMontosSelect, DatosTurno, OprLevelII } from '../../../../pages-models/model-general';
import { TurnosService } from '../../../../pages-services/serv-general/turnos.service';
import { CierreTurnoService } from '../../../../pages-services/serv-reca/cierre-turno.service';
import { TurnosCierre } from '../../../../pages-models/model-global';
import { NgbModal, ModalDismissReasons, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { GetUtils } from '../../../../pages-models/model-utils';
import { UtilsService } from '../../../../pages-services/serv-utils/utils.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-turnos-montos',
  templateUrl: './turnos-montos.component.html',
  styleUrls: ['./turnos-montos.component.scss'],
  providers: [NgbPopoverConfig] // add NgbPopoverConfig to the component providers
})
export class TurnosMontosComponent implements OnInit {
  turnosMontosSelect: TurnosMontosSelect;
  apertura = '';
  total = '';
  turA = [];
  msjModal = '';
  closeResult: string;
  turnosCierre: TurnosCierre;
  operacion = '';
  turno = '';
  usuario = '';
  medioPago: GetUtils;
  turnoC: {
    'medioPago': string,
    'monto': string,
  };
  rowsMT: {
    'medioPago': string,
    'titulo': string,
    'monto': string,
    'control': string
  };
  oprLevelII: OprLevelII;
  divEnabledDetOper = false;
  pag = 'turno-cierre';

  // Estos datos vienen de Cerrar central (turnos-abiertos) o de Consultar turnos (turnos)
  @Input() datosT: DatosTurno;
  @Input() fechaDesde: string;
  @Input() fechaHasta: string;
  @Input() rex: string;
  @Input() rexDesc: string;
  @Input() sucursal: string;
  @Input() sucDesc: string;
  @Input() terminal: string;
  @Input() terDesc: string;
  @Input() pagina: string;

  @ViewChild(DatatableComponent) tabMon: DatatableComponent;
  data = [];
  rows: any[] = [];
  temp = [];
  divList = false;
  msj = '';
  existe = false;

  constructor(
    private turnosService: TurnosService,
    private cierreTurnoService: CierreTurnoService,
    private modalService: NgbModal,
    private router: Router,
    private utilsService: UtilsService,
    private config: NgbPopoverConfig
  ) {
    this.turnosMontosSelect = new TurnosMontosSelect('', '', '', '', '', '');
    this.datosT = new DatosTurno('', '', '', '', '', '', '', '', '');
    this.turnosCierre = new TurnosCierre('', '', '', '', '', '', '', [{ medioPago: '', monto: '' }]);
    this.oprLevelII = new OprLevelII('', '', '', '', '');
    this.medioPago = new GetUtils('', '');
    // customize default values of popovers used by this component tree
    config.placement = 'top-right';
    config.triggers = 'hover';
    config.container = 'body';
  }

  ngOnInit() {
    this.data = [];
    this.turnosMontosSelect.rex = this.rex;
    this.turnosMontosSelect.sucursal = this.sucursal;
    this.turnosMontosSelect.usuario = this.datosT.usuario;
    this.turA = this.datosT.turno.split('.');
    this.turnosMontosSelect.turno = this.turA[0];
    this.turnosService.getTurnosMontos(this.turnosMontosSelect).subscribe(
      (response:any) => {
        this.apertura = response.apertura;
        this.total = response.total;
        const dir = response.rowCount;
        if (dir > 0) {
          this.existe = true;
          this.data = response.rows;
          this.temp = this.data;
          if (this.pagina === 'turnos') { // Si se llama desde turnos
            this.divList = true;
            this.rows = this.data;
          } else { // Si se llama desde turnos-abiertos
            this.listMediosPago();
          }
        } else {
          if (this.pagina === 'turnos') { // Si se llama desde turnos
            this.msj = 'No hay resultados.';
          } else { // Si se llama desde turnos-abiertos
            this.listMediosPago();
          }
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  /* Se listan todos los Medios de Pago cuando se llama desde turnos-abiertos. Si el turno
     ya tenia medios de pago registrados (existe = true), entonces se muestran dichos
     valores, si no (existe = false) se muestran los medios de pago en cero(0).
  */
  listMediosPago() {
    this.utilsService.getMedioPago(this.medioPago).subscribe(
      (response:any) => {
        const dir = response.rowCount;
        if (dir > 0) {
          this.divList = true;
          this.data = response.rows
          if (this.existe) {
            for (let i = 0; i < this.data.length; i++) {
              let cont = 0;
              for (let j = 0; j < this.temp.length; j++) {
                if (this.temp[j].titulo === this.data[i].titulo) {
                  this.rowsMT = {
                    medioPago: this.data[i].codigo,
                    titulo: this.temp[j].titulo,
                    monto: this.temp[j].monto,
                    control: this.data[i].tipo
                  };
                  this.rows[i] = this.rowsMT;
                  cont++;
                }
              }
              if (cont === 0) {
                this.rowsMT = {
                  medioPago: this.data[i].codigo,
                  titulo: this.data[i].titulo,
                  monto: '0',
                  control: this.data[i].tipo
                };
                this.rows[i] = this.rowsMT;
              }
            }
          } else {
            for (let i = 0; i < this.data.length; i++) {
              this.rowsMT = {
                medioPago: this.data[i].codigo,
                titulo: this.data[i].titulo,
                monto: '0',
                control: this.data[i].tipo
              };
              this.rows[i] = this.rowsMT;
            }
          }
        } else {
          this.msj = 'No hay resultados';
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  /* Se actualiza en el arreglo de medios de pago, el monto de la fila que se esta 
     modificando, para posteriormente guardarlos si se cierra el turno.
  */
  updateMontoValue(event, cell, rowIndex) { 
    this.msj = '';
    if(event.target.value.indexOf(',') >= 0 || event.target.value.indexOf('.') >= 0
        || event.target.value.indexOf('e') >= 0 || event.target.value.indexOf(' ') == 0
        || event.target.value == ''){
      this.msj = 'El monto debe contener solo números.';
      return false;
    } else {
      this.rows[rowIndex][cell] = event.target.value;
      this.rows = [...this.rows];
    }
  }

  format(event, cell, rowIndex){ 
    let num =  event.target.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      this.rows[rowIndex][cell] = num;
      this.rows = [...this.rows];
    }
  }

  // Se abre un modal con mensaje de confirmacion de cierre de turno
  open(content) {
    this.msjModal = '¿Está seguro que quiere cerrar el turno?';
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  /* Funcion que redirige a la pagina de Cierre central (turnos-abiertos),
     con los valores traidos desde dicha pagina.
  */
  onVolver() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/pages/cierre-turno', JSON.stringify(this.fechaDesde), JSON.stringify(this.fechaHasta), 
        this.rex, this.rexDesc, this.sucursal, this.sucDesc, this.terminal, this.terDesc]));
  }

  /* Funcion que guarda en la BD el cierre de turno y posteriormente
     abre la pagina del Detalle de operaciones (operaciones-detalle),
     donde se visualiza el turno completo.
  */
  cerrarTurno() {
    this.turnosCierre.rex = this.rex;
    this.turnosCierre.sucursal = this.sucursal;
    this.turnosCierre.terminal = this.datosT.terminal;
    this.turnosCierre.usuario = this.datosT.usuario;
    this.turnosCierre.turno = this.turA[0];
    if (this.rows.length > 0) {
      for (let i = 0; i < this.rows.length; i++) {
        this.turnoC = {
          medioPago: this.rows[i].medioPago,
          monto: this.rows[i].monto
        };
        this.turnosCierre.rows[i] = this.turnoC;
      }
      if(this.turnosCierre.rows.length > 0){
        this.cierreTurnoService.closeTurnos(this.turnosCierre).subscribe(
          (response:any) => {
            const code = response.code;
            this.operacion = response.operacion;
            this.turno = response.turno;
            this.usuario = response.usuario;
            if (code === '0') {
              this.oprLevelII.operacion = this.operacion;
              this.oprLevelII.turno = this.turno;
              this.oprLevelII.usuario = this.usuario;
              swal('Cierre Turno', 'Turno cerrado con éxito', 'success');
              this.divEnabledDetOper = true;
            } else {
              swal('Cierre Turno', response.description, 'error');
            }
          },
          error => {
            console.log('Error: ' + JSON.stringify(error));
          }
        )
      }
    }    
  }
}
