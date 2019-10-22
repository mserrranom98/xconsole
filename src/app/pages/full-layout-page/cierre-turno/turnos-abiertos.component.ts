import { Component, OnInit, ViewChild } from '@angular/core';
import { SucSelect, RexSelect, TerSelect } from '../../pages-models/model-emp-rec';
import { NgbDateStruct, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { EmpRexsService } from '../../pages-services/serv-emp-rec/emp-rexs.service';
import { SucursalesService } from '../../pages-services/serv-emp-rec/sucursales.service';
import { TerminalesService } from '../../pages-services/serv-emp-rec/terminales.service';
import { TurnosAbiertosSelect } from '../../pages-models/model-global';
import { CierreTurnoService } from '../../pages-services/serv-reca/cierre-turno.service';
import { NgbDateCustomParserFormatter } from '../../../pipes/date-format.pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-turnos-abiertos',
  templateUrl: './turnos-abiertos.component.html',
  styleUrls: ['./turnos-abiertos.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class TurnosAbiertosComponent implements OnInit {
  turnosAbiertosSelect: TurnosAbiertosSelect;
  sucSelect: SucSelect;
  terSelect: TerSelect;
  fechaIni: NgbDateStruct;
  fechaFin: NgbDateStruct;
  rexSelect: RexSelect;
  termi = '';
  listEmpRex: any[];
  listSuc: any[];
  listTer: any[];
  rexDesc = '';
  sucDesc = '';
  terDesc = '';
  msjFiltro = '';
  fInicial = '';
  fFinal = '';
  datos: any[];
  divEnabled = true;
  pagina = 'turnos-abiertos';
  suc = '';
  ter = '';

  @ViewChild(DatatableComponent) table: DatatableComponent;
  data = [];
  rows: any[] = [];
  divList = false;
  msj = '';

  constructor(
    private empRexsService: EmpRexsService,
    private sucursalesService: SucursalesService,
    private cierreTurnoService: CierreTurnoService,
    private terminalesService: TerminalesService,
    private route: ActivatedRoute
  ) {
    this.turnosAbiertosSelect = new TurnosAbiertosSelect('', '', '', '', '', '', '');
    this.rexSelect = new RexSelect('', '');
    this.sucSelect = new SucSelect('', '', '');
    this.terSelect = new TerSelect('', '', '', '');
  }

  /* Se comprueba si la url viene con parametros, esto quiere decir que el componente se
     llamo desde otro a traves del boton Volver (desde turnos-montos u operaciones-detalle),
     para que la pagina se cargue con dichos valores, si no se carga con sus valores iniciales.
  */
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['fi'] != null && params['fi'] != 'undefined') {
        this.fechaIni = JSON.parse(params['fi']);
      }
      if (params['fh'] != null && params['fh'] != 'undefined') {
        this.fechaFin = JSON.parse(params['fh']);
      }
      if (params['rex'] != null && params['rex'] != 'undefined') {
        this.empRexsService.getRex().subscribe(
          (response:any) => {
            this.listEmpRex = response.rexs;
            this.sucSelect.rex = params['rex'];
            this.terSelect.rex = params['rex'];
            this.turnosAbiertosSelect.rex = params['rex'];
            this.rexDesc = params['rexD'];
            if (params['suc'] != null && params['suc'] != 'undefined') {
              this.terSelect.sucursal = params['suc'];
              this.turnosAbiertosSelect.sucursal = params['suc'];
              this.sucDesc = params['sucD'];
              this.suc = params['suc'];
              this.sucursal('');
              if (params['ter'] != null && params['ter'] != 'undefined') {
                this.turnosAbiertosSelect.terminal = params['ter'];
                this.terDesc = params['terD'];
                this.ter = params['ter'];
                this.termi = params['ter'];
                this.selTerminal('');
              }
            }
          },
          error => {
            console.log('Error: ' + JSON.stringify(error));
          }
        )
      } else { // Valores iniciales
        this.empRexsService.getRex().subscribe(
          (response:any) => {
            this.listEmpRex = response.rexs;
          },
          error => {
            console.log('Error: ' + JSON.stringify(error));
          }
        )
      }
    });
  }

  sucursal(args) {
    this.listSuc = [];
    this.listTer = [];
    this.divList = false;
    if (this.suc != '') { // Con valor de url
      this.sucursalesService.getSuc(this.sucSelect.rex).subscribe(
        (response:any) => {
          this.listSuc = response.sucursales;
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    } else {
      this.terSelect.sucursal = '';
      this.turnosAbiertosSelect.sucursal = '';
      this.rexDesc = args.target.options[args.target.selectedIndex].text;
      this.sucursalesService.getSuc(this.sucSelect.rex).subscribe(
        (response:any) => {
          this.listSuc = response.sucursales;
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }

  selTerminal(args) {
    this.listTer = [];
    this.divList = false;
    if (this.ter != '') { // Con valor de url
      this.terminalesService.getTer(this.terSelect.sucursal).subscribe(
        (response:any) => {
          this.listTer = response.terminales;
          this.buscar();
          this.suc = '';
          this.ter = '';
          this.turnosAbiertosSelect.terminal = '';
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    } else {
      this.turnosAbiertosSelect.terminal = '';
      this.termi = '';
      this.sucDesc = args.target.options[args.target.selectedIndex].text;
      this.terminalesService.getTer(this.terSelect.sucursal).subscribe(
        (response:any) => {
          this.listTer = response.terminales;
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }

  getDescTerminal(args) {
    this.terDesc = args.target.options[args.target.selectedIndex].text;
  }

  buscar() {

    if (this.validar()) {
      this.divList = false;
      this.data = [];
      if (this.fechaIni !== undefined && this.fechaFin !== undefined) {
        this.fInicial = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day + ' 00:00:00';
        this.fFinal = this.fechaFin.year + '-' + this.fechaFin.month + '-' + this.fechaFin.day + ' 23:59:59';
      }

      this.msj = '';
      this.turnosAbiertosSelect.startDate = this.fInicial;
      this.turnosAbiertosSelect.endDate = this.fFinal;
      this.cierreTurnoService.getTurnosAbiertos(this.turnosAbiertosSelect).subscribe(
        (response:any) => {
          const dir = response.rowCount;
          if (dir > 0) {
            this.divList = true;
            this.data = response.rows
            this.rows = this.data;
          } else {
            this.msj = 'No hay resultados';
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        })
    }
  }

  validar(): boolean {
    this.msjFiltro = '';

    if (this.fechaIni !== undefined && this.fechaFin === undefined) {
      this.msjFiltro = 'Debe indicar Fecha Hasta';
      return false;
    } else if (this.fechaIni === undefined && this.fechaFin !== undefined) {
      this.msjFiltro = 'Debe indicar Fecha Desde';
      return false;
    } else if (this.fechaIni === undefined && this.fechaFin === undefined) {
      this.msjFiltro = 'Debe indicar rango de Fechas';
      return false;
    }

    if (this.fechaIni !== undefined && this.fechaFin !== undefined) {
      const fechaIni = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day;
      const fechaFin = this.fechaFin.year + '-' + this.fechaFin.month + '-' + this.fechaFin.day;
      const today = new Date();

      const aux_I = fechaIni.split('-');
      const fI = new Date(parseInt(aux_I[0], 10), parseInt(aux_I[1], 10) - 1, parseInt(aux_I[2], 10));

      const aux_F = fechaFin.split('-');
      const fF = new Date(parseInt(aux_F[0], 10), parseInt(aux_F[1], 10) - 1, parseInt(aux_F[2], 10));

      if (fI > today) {
        this.msjFiltro = 'Fecha Desde es mayor a la Fecha Actual. Verifique información';
        return false;
      } else if (fF > today) {
        this.msjFiltro = 'Fecha Hasta es mayor a la Fecha Actual. Verifique información';
        return false;
      } else if (fI > fF) {
        this.msjFiltro = 'Fecha Desde es mayor a la Fecha Hasta. Verifique información';
        return false;
      }

      if (this.turnosAbiertosSelect.rex === '') {
        this.msjFiltro = 'Debe indicar una empresa.';
        return false;
      }
      if (this.turnosAbiertosSelect.sucursal === '') {
        this.msjFiltro = 'Debe indicar una sucursal.';
        return false;
      }
      if (this.turnosAbiertosSelect.terminal === '') {
        this.msjFiltro = 'Debe indicar un terminal.';
        return false;
      }
    }
    return true;
  }

  /* Se obtienen los valores de la fila, se abre la pagina de medios de pago (turnos-montos) para
     validar los montos o cambiarlos de ser necesario y se cierra el turno desde dicha pagina.
  */
  openMediosPago(rowIndex) {
    this.divEnabled = false;
    this.datos = this.rows[rowIndex];
  }

  validaFecha(fechas, tipo) {
    this.msj = ''; 
    let fec = fechas;
    let error = false;
    let dia=null;
    let mes=null;
    let anno=null;
    let campo=tipo;

    if(fec!=null && fec!=""){
      if (fec.length>0){
          // La longitud de la fecha debe tener exactamente 10 caracteres
          if ( fec.length!==10){
            error = true; 
          }
           // Primero verifica el patron
          if ( !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fec) ){
            error = true; 
          }
          // Mediante el delimitador "/" separa dia, mes y año
          if(!fec.split("-")){
            error = true;
          }else{
            let fehca = fec.split("-")
            dia=parseInt(fehca[0]);
            mes=parseInt(fehca[1]);
            anno=parseInt(fehca[2]);
          }         

          // Verifica que dia, mes, año, solo sean numeros
          error = ( isNaN(dia) || isNaN(mes) || isNaN(anno) );

          // Lista de dias en los meses, por defecto no es año bisiesto
          var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
          if ( mes === 1 || mes > 2 )
              if ( dia > ListofDays[mes-1] || dia < 0 || ListofDays[mes-1] === undefined )
                error = true;

          // Detecta si es año bisiesto y asigna a febrero 29 dias
          if ( mes === 2 ) {
              var lyear = ( (!(anno % 4) && anno % 100) || !(anno % 400) );
              if ( lyear === false && dia >= 29 )
                error = true;
              if ( lyear === true && dia > 29 )
                error = true;
          }
       
      }
     
      if ( error ) {
        this.msj = 'Fecha Inválida: * La Fecha debe tener el formato: dd-mm-aaaa (dia-mes-año).\n'; 
        
        if(campo === 'in'){        
          $('input[name="dpi"]').blur(function(){           
              $('input[name="dpi"]').val("");
           }  
          );        
        }
        
        if(campo === 'out'){
          $('input[name="dpf"]').blur(function(){
            $('input[name="dpf"]').val("");
         }  
        );             
        }
             
         return false;
      }
      else      

      return true;    

    } 
  }
}
