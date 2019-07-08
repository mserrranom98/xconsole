import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OperacionesService } from '../../../../pages-services/serv-general/operaciones.service';
//import { OprLevelII, ResultI, OprLevelIII } from '../../../../pages-models/model-general';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OprLevelII, ResultI, OprLevelIII } from '../../../../pages-models/model-general';

@Component({
  selector: 'app-operaciones-detalle',
  templateUrl: './operaciones-detalle.component.html'
})
export class OperacionesDetalleComponent implements OnInit {
  @ViewChild(DatatableComponent) tblList: DatatableComponent;
  oprLevelII: OprLevelII;
  resultI: ResultI;
  divEnabled = false;
  data = []; 
  rows = []; 
  msj = '';
  opc = new Object();
  sigDisable = false;
  antDisable = false;
  closeResult: string;
  datos: OprLevelIII;
  glosa = '';

  /* Datos que vienen del Cierre central (turnos-abiertos y turnos-montos) o
     Consulta de turnos (turnos).
  */
  @Input() datOprII: OprLevelII;
  @Input() pagina: string;
  @Input() fechaDesde: string;
  @Input() fechaHasta: string;
  @Input() rex: string;
  @Input() rexDesc: string;
  @Input() sucursal: string;
  @Input() sucDesc: string;
  @Input() terminal: string;
  @Input() terDesc: string;

  constructor(
    private operacionesService: OperacionesService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.oprLevelII = new OprLevelII('', '', '', '', '');
    this.resultI = new ResultI('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
    this.datos = new OprLevelIII('', '', '', '', '', '', '');
    this.datOprII = new OprLevelII('', '', '', '', '');
  }

  /* Si el componente se llama desde Cierre central (turnos-abiertos y turnos-montos) o desde
     Consulta de turnos (turnos), se carga con dichos valores, si no es porque se llama desde
     Consulta de operaciones (operaciones).
  */
  ngOnInit() {
    
    if (this.pagina === 'turno-cierre' || this.pagina === 'turnos') {
      this.divEnabled = true;
      this.oprLevelII = this.datOprII;
      this.detalle();
    }
  }

  detalle() {
    $('#loading').css('display', 'block');
    this.operacionesService.getOperacionesII(this.oprLevelII).subscribe(
      (response:any) => {
        if (response.code === '0') {
          for (let i = 0; i < response.rowCount; i++) {
            let detDesc = ''
            if (response.rows[i].detalle === '-1') {
              detDesc = '(FALTANTE)';
            } else if (response.rows[i].detalle === '-2') {
              detDesc = '(SOBRANTE)';
            } else if (response.rows[i].detalle === '-3') {
              detDesc = '(POSITIVO)';
            } else if (response.rows[i].detalle === '-4') {
              detDesc = '(NEGATIVO)';
            } else {
              detDesc = '';
            }
            this.opc = {
              calidadGlosa: response.rows[i].calidadGlosa,
              detalle: response.rows[i].detalle,
              instrumento: response.rows[i].instrumento,
              instrumentoGlosa: response.rows[i].instrumentoGlosa + ' ' + detDesc,
              monto: response.rows[i].monto
            },
              this.data[i] = this.opc;
          }
          this.resultI.terminalGlosa = response.terminalGlosa;
          this.resultI.usuario = response.usuario;
          this.resultI.turno = response.turno;
          this.resultI.operacion = response.operacion;
          this.resultI.fechaRegistro = response.fecha;
          this.resultI.fechaRecaudacion = response.fecha;
          this.resultI.estado = response.estado;
          this.resultI.folio = response.folio;

          this.rows = this.data;
          this.sigDisable = false;
        } else {
          this.sigDisable = true;
          const sig = parseInt(this.oprLevelII.operacion, 10) - 1;
          this.oprLevelII.operacion = sig.toString();
        }

        if (this.resultI.operacion === '1') {
          this.antDisable = true;
        } else {
          this.antDisable = false;
        }
        $('#loading').css('display', 'none');
      }
    )
  }

  recibirDatos(event) {
    console.log('REBE: '+ event);
    console.log('divEnabled: ' + this.divEnabled);
    if (event !== null) {
      this.divEnabled = true;
      // tslint:disable-next-line:prefer-const
      let obj = JSON.parse(event);
      this.resultI.contexto = obj[0].contexto;
      this.resultI.estado = obj[0].estado;
      this.resultI.estadoGlosa = obj[0].estadoGlosa;
      this.resultI.fechaRecaudacion = obj[0].fechaRecaudacion;
      this.resultI.fechaRegistro = obj[0].fechaRegistro;
      this.resultI.folio = obj[0].folio;
      this.resultI.monto = obj[0].monto;
      this.resultI.operacion = obj[0].operacion;
      if (this.resultI.operacion === '1') {
        this.antDisable = true;
        this.sigDisable = false;
      } else {
        this.antDisable = false;
        this.sigDisable = false;
      }
      this.oprLevelII.operacion = obj[0].operacion;
      this.resultI.rex = obj[0].rex;
      this.resultI.rexGlosa = obj[0].rexGlosa;
      this.resultI.sucursal = obj[0].sucursal;
      this.resultI.sucursalGlosa = obj[0].sucursalGlosa;
      this.resultI.terminal = obj[0].terminal;
      this.resultI.terminalGlosa = obj[0].terminalGlosa;
      this.resultI.tipo = obj[0].tipo;
      this.resultI.tipoGlosa = obj[0].tipoGlosa;
      this.resultI.turno = obj[0].turno;
      this.oprLevelII.turno = obj[0].turno;
      this.resultI.usuario = obj[0].usuario;
      this.oprLevelII.usuario = obj[0].usuario;
  
      this.detalle();
    }
  }

  /* Funcion que redirige a la pagina de Consulta de turno (turnos) o
     a Cierre de turno (turnos-abiertos y turnos-montos) o a Consulta de operaciones (operaciones),
     cargando dichas paginas con los valores traidos desde cada una de ellas.
  */
  onVolver() {
    this.divEnabled = false;
    this.sigDisable = false;
    this.antDisable = false;
    if (this.pagina === 'turnos') { // Va a Consulta de turnos (turnos)
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/general/operaciones/consultas/turnos', JSON.stringify(this.fechaDesde), JSON.stringify(this.fechaHasta), 
          this.rex, this.rexDesc, this.sucursal, this.sucDesc]));
    } else if (this.pagina === 'turno-cierre') { // Va a Cierre de turno (turnos-abiertos y turnos-montos)
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/pages/cierre-turno', JSON.stringify(this.fechaDesde), JSON.stringify(this.fechaHasta), 
          this.rex, this.rexDesc, this.sucursal, this.sucDesc, this.terminal, this.terDesc]));
    } else { // Va a Consulta de operaciones (operaciones)
      this.router.navigate(['/general/operaciones/consultas/operaciones']);
    }
  }

  siguiente() {
    this.data = [];
    const sig = parseInt(this.oprLevelII.operacion, 10) + 1;
    this.oprLevelII.operacion = sig.toString();
    this.detalle();
  }

  anterior() {
    this.data = [];
    const sig = parseInt(this.oprLevelII.operacion, 10) - 1;
    this.oprLevelII.operacion = sig.toString();
    this.detalle();
  }

  public open(content, rowIndex) {
    this.datos = new OprLevelIII('', '', '', '', '', '', '');
    this.datos.usuario = this.resultI.usuario;
    this.datos.turno = this.resultI.turno;
    this.datos.operacion = this.resultI.operacion
    this.datos.detalle = this.rows[rowIndex].detalle;
    this.datos.instrumento = this.rows[rowIndex].instrumento;
    this.glosa = this.rows[rowIndex].instrumentoGlosa;
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

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
