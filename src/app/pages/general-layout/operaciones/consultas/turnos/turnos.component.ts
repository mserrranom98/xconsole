import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { NgbDateCustomParserFormatter } from '../../../../../pipes/date-format.pipe';
import { TurnosSelect } from '../../../../pages-models/model-general';
import { SucSelect, RexSelect } from '../../../../pages-models/model-emp-rec';
import { EmpRexsService } from '../../../../pages-services/serv-emp-rec/emp-rexs.service';
import { SucursalesService } from '../../../../pages-services/serv-emp-rec/sucursales.service';
import { TurnosService } from '../../../../pages-services/serv-general/turnos.service';
import swal from 'sweetalert2';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styles: [],
  styleUrls: ['./turnos.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class TurnosComponent implements OnInit {
  [x: string]: any;
  isCollapsed = false;
  turnosSelect: TurnosSelect;
  sucSelect: SucSelect;
  fechaIni: NgbDateStruct;
  fechaFin: NgbDateStruct;
  rexSelect: RexSelect;
  listEmpRex: any[];
  listSuc: any[];
  msjFiltro = '';
  fInicial = '';
  fFinal = '';
  closeResult: string;
  datos: any[];
  selected = [];
  divEnabled = true;
  pagina = 'turnos';
  sucur = '';
  rexDesc = '';
  sucDesc = '';
  terDesc = '';
  suc = '';
  lisExport = [];
  datExp = new Object();

  @ViewChild(DatatableComponent) table: DatatableComponent;
  data = [];
  rows: any[] = [];
  temp = [];
  divList = false;
  msj = '';

  constructor(
    private empRexsService: EmpRexsService,
    private sucursalesService: SucursalesService,
    private turnosService: TurnosService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {
    this.turnosSelect = new TurnosSelect('', '', '', '', '', '');
    this.rexSelect = new RexSelect('', '');
    this.sucSelect = new SucSelect('', '', '');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['fi']!=null && params['fi']!='undefined'){
        this.fechaIni = JSON.parse(params['fi']);
      }
      if(params['fh']!=null && params['fh']!='undefined'){
        this.fechaFin = JSON.parse(params['fh']);
      }
      if(params['rex']!=null && params['rex']!='undefined'){
        this.empRexsService.getRex(this.rexSelect).subscribe(
          (response:any) => {
            this.listEmpRex = response.rexs;
            this.sucSelect.rex = params['rex'];
            this.turnosSelect.rex = params['rex'];
            this.rexDesc = params['rexD'];
            if(params['suc']!=null && params['suc']!='undefined'){
              this.turnosSelect.sucursal = params['suc'];
              this.sucDesc = params['sucD'];
              this.suc = params['suc'];
              this.sucur = params['suc'];
              this.sucursal('');
            }
          })
      } else { // Valores iniciales
        this.empRexsService.getRex(this.rexSelect).subscribe(
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
    this.divList = false;
    if(this.suc != ''){ // Con valor de url
      this.sucursalesService.getSuc(this.sucSelect).subscribe(
        (response:any) => {
          this.listSuc = response.sucursales;
          this.buscar();
          this.suc = '';
          this.turnosSelect.sucursal = '';
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    } else {
      this.turnosSelect.sucursal = '';
      this.sucur = '';
      this.rexDesc = args.target.options[args.target.selectedIndex].text;
      this.sucursalesService.getSuc(this.sucSelect).subscribe(
        (response:any) => {
          this.listSuc = response.sucursales;
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }

  getDescSucursal(args) {
    this.sucDesc = args.target.options[args.target.selectedIndex].text;
  }

  buscar() {
    if (this.validar()) {
      this.divList = false;
      this.data = [];
      this.lisExport = [];
      if (this.fechaIni != undefined && this.fechaFin != undefined) {
        this.fInicial = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day + ' 00:00:00';
        this.fFinal = this.fechaFin.year + '-' + this.fechaFin.month + '-' + this.fechaFin.day + ' 23:59:59';
      }
      let codigo=0; 
      this.msj = '';
      this.turnosSelect.startDate = this.fInicial;
      this.turnosSelect.endDate = this.fFinal;
      this.datExp = new Object();
      this.turnosService.getTurnos(this.turnosSelect).subscribe(
        (response:any) => {
          codigo = parseInt(response.code);          
          if(codigo !== 0 ){         
            swal('Turnos','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
            $('#loading').css('display', 'none');
         }else{
          if (response.rowCount > 0) {
            for (let i = 0; i < response.rowCount; i++) {
              this.datExp = {
                Rex: this.rexDesc,
                Sucursal: this.sucDesc,
                Usuario: response.rows[i].usuario,
                Turno: this.formatoFechaHora(new Date(response.rows[i].turno)),
                Terminal: response.rows[i].terminalDescripcion,
                Abierto: response.rows[i].abierto,
                Cierres: parseInt(response.rows[i].intentosCierre, 10),
                Fecha_Cierre: this.formatoFechaHora(new Date(response.rows[i].fechaCierre)),
                Numero: parseInt(response.rows[i].numero, 10)
              }
              this.lisExport[i] = this.datExp;
            }
            this.divList = true;
            this.isCollapsed = true;
            this.data = response.rows
            this.rows = this.data;
            this.temp = this.data;
          } else {
            this.msj = 'No hay resultados.';
          }
         }          
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }

  formatoFechaHora(fecha: Date): string {
    let dd: string;
    let mm: string;
    let hh: string;
    let mi: string;
    let ss: string;
    if (fecha.getDate() < 10) {
      dd = '0' + fecha.getDate();
    } else {
      dd = fecha.getDate().toString();
    }
    if (fecha.getMonth() + 1 < 10) {
      mm = '0' + fecha.getMonth() + 1;
    } else {
      mm = (fecha.getMonth() + 1).toString()
    }
    if (fecha.getHours() < 10) {
      hh = '0' + fecha.getHours();
    } else {
      hh = fecha.getHours().toString();
    }
    if (fecha.getMinutes() < 10) {
      mi = '0' + fecha.getMinutes();
    } else {
      mi = fecha.getMinutes().toString();
    }
    if (fecha.getSeconds() < 10) {
      ss = '0' + fecha.getSeconds();
    } else {
      ss = fecha.getSeconds().toString();
    }

    return dd + '-' + mm + '-' + fecha.getFullYear() + ' ' + hh + ':' + mi + ':' + ss;
  }

  validar(): boolean {
    this.msjFiltro = '';

    if (this.fechaIni != undefined && this.fechaFin == undefined) {
      this.msjFiltro = 'Debe indicar Fecha Hasta.';
      return false;
    } else if (this.fechaIni == undefined && this.fechaFin != undefined) {
      this.msjFiltro = 'Debe indicar Fecha Desde.';
      return false;
    } else if (this.fechaIni == undefined && this.fechaFin == undefined) {
      this.msjFiltro = 'Debe indicar rango de Fechas.';
      return false;
    }

    if (this.fechaIni != undefined && this.fechaFin != undefined) {
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

      if (this.turnosSelect.rex === '') {
        this.msjFiltro = 'Debe indicar la empresa.';
        return false;
      }
      if (this.turnosSelect.sucursal === '') {
        this.msjFiltro = 'Debe indicar la sucursal.';
        return false;
      }
    }
    return true;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.usuario.toLowerCase().indexOf(val) !== -1 || d.terminal.toLowerCase().indexOf(val) !== -1;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  /* Abre la pagina del Detalle del turno (turnos-detalle),
     con los valores de la fila seleccionada.
  */
  openDetail() {
    this.datos = this.selected;
    this.divEnabled = false;
  }

  /* Abre modal con los Medios de Pago y sus respectivos montos (turnos-montos),
     segun la fila seleccionada.
  */
  open(content, rowIndex) {
    this.datos = this.rows[rowIndex];
    this.terDesc = this.rows[rowIndex].terminalDescripcion;
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

  exportar() {
    const ws = XLSX.utils.aoa_to_sheet([
      ['BANCO CONSORCIO'],
      ['CONSULTA DE TURNO'],
      [],
    ]);
    XLSX.utils.sheet_add_json(ws, this.lisExport, { origin: 'B5' });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Turnos');

    const wscols = [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 },
    { width: 25 }, { width: 25 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }];
    ws['!cols'] = wscols;

    const workbook: XLSX.WorkBook = { Sheets: { 'Turnos': ws }, SheetNames: ['Turnos'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true });

    const d = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const fecha = d.getDate() + '_' + months[d.getMonth()] + '_' + d.getFullYear();

    this.saveAsExcelFile(excelBuffer, 'Turnos' + fecha);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
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
