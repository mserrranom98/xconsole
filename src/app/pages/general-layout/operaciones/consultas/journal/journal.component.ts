import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NgbDateCustomParserFormatter } from '../../../../../pipes/date-format.pipe';
import { RexSelect, SucSelect, TerSelect } from '../../../../pages-models/model-emp-rec';
import { JournalSelect } from '../../../../pages-models/model-general';
import { SucursalesService } from '../../../../pages-services/serv-emp-rec/sucursales.service';
import { TerminalesService } from '../../../../pages-services/serv-emp-rec/terminales.service';
import { EmpRexsService } from '../../../../pages-services/serv-emp-rec/emp-rexs.service';
import { JournalService } from '../../../../pages-services/serv-general/journal.service';
import swal from 'sweetalert2';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})

export class JournalComponent implements OnInit {
  @ViewChild('frmJou') f: NgForm;
  @ViewChild(DatatableComponent) tblList: DatatableComponent;

  fechaIni: NgbDateStruct;
  isCollapsed = false;
  fechaFin: NgbDateStruct;
  rexSelect: RexSelect;
  sucSelect: SucSelect;
  terSelect: TerSelect;
  journalSelect: JournalSelect
  listEmpRex: any[];
  listSuc: any[];
  listTer: any[];

  fInicial = '';
  fFinal = '';
  msjFecha: string;
  sucSel = '';
  @ViewChild('table') table: any;
  data = [];
  rows: any[] = [];
  columns = [];
  temp = [];
  opc = new Object();
  divList = false;
  msj = '';

  constructor(
    private sucursalesService: SucursalesService,
    private terminalesService: TerminalesService,
    private empRexsService: EmpRexsService,
    private journalService: JournalService,
  ) {
    this.rexSelect = new RexSelect('', '');
    this.sucSelect = new SucSelect('', '', '');
    this.terSelect = new TerSelect('', '', '', '');
    this.journalSelect = new JournalSelect('', '', '', '', '', '');
  }

  ngOnInit() {
    // Empresas
    this.empRexsService.getRex(this.rexSelect).subscribe(
      (response:any) => {
        this.listEmpRex = response.rexs;
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  sucursal() {
    this.listSuc = [];
    this.listTer = [];
    this.divList = false;
    this.sucursalesService.getSuc(this.sucSelect).subscribe(
      (response:any) => {
        this.listSuc = response.sucursales;
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  selTerminal() {
    this.listTer = [];
    this.divList = false;
    this.terminalesService.getTer(this.terSelect).subscribe(
      (response:any) => {
        this.listTer = response.terminales;
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  buscar() {
    this.validar();
    this.data = [];
    if (this.fechaIni !== undefined && this.fechaFin !== undefined) {
      this.fInicial = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day + ' 00:00:00';
      this.fFinal = this.fechaFin.year + '-' + this.fechaFin.month + '-' + this.fechaFin.day + ' 23:59:59';
    }
    let codigo=0;  
    if (this.validar() === true) {
      this.msj = '';
      this.journalSelect.startDate = this.fInicial;
      this.journalSelect.endDate = this.fFinal;      
      this.journalService.getJournal(this.journalSelect).subscribe(        
        (response:any) => {          
          codigo = parseInt(response.code);                
          if(codigo !== 0 ){         
            swal('Journal','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
            $('#loading').css('display', 'none');
         }else{
          const dir = response.events.length;
          if (dir > 0) {
            this.divList = true;
            for (let i = 0; i < dir; i++) {
              this.opc = {
                cajero: response.events[i].cajero,
                eventData: response.events[i].eventData,
                eventDate: response.events[i].eventDate,
                terminal: response.events[i].terminal
              }
              this.data[i] = this.opc;
            }
            this.isCollapsed = true;
            this.rows = this.data;
            this.temp = this.data;
          } else {
            this.msj = 'No hay resultados';
            this.divList = false;
          }
         }          
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        })
    }
  } 

  validar(): boolean {
    this.msjFecha = '';

    if (this.fechaIni !== undefined && this.fechaFin === undefined) {
      this.msjFecha = 'Debe indicar Fecha Hasta';
      return false;
    } else if (this.fechaIni === undefined && this.fechaFin !== undefined) {
      this.msjFecha = 'Debe indicar Fecha Desde';
      return false;
    } else if (this.fechaIni === undefined && this.fechaFin === undefined) {
      this.msjFecha = 'Debe indicar rango de Fechas';
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
        this.msjFecha = 'Fecha Desde es mayor a la Fecha Actual. Verifique información';
        return false;
      } else if (fF > today) {
        this.msjFecha = 'Fecha Hasta es mayor a la Fecha Actual. Verifique información';
        return false;
      } else if (fI > fF) {
        this.msjFecha = 'Fecha Desde es mayor a la Fecha Hasta. Verifique información';
        return false;
      }
}
return true;

}

updateFilter(event) {
  const val = event.target.value.toLowerCase();

  const temp = this.temp.filter(function (d) {
    return d.cajero.toLowerCase().indexOf(val) !== -1;
  });

  this.rows = temp;
  this.tblList.offset = 0;
}

exportar() {
  const json = JSON.parse(JSON.stringify(this.rows));
  const ws = XLSX.utils.aoa_to_sheet([
    ['BANCO CONSORCIO'],
    ['INFORME DE AUDITORIA'],
    [],
  ]);


  const header = ['cajero', 'eventData', 'eventDate', 'terminal'];
  XLSX.utils.sheet_add_json(ws, this.rows, { header: header, origin: 'B7' });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Journal');

  const wscols = [{ width: 18 }, { width: 18 }, { width: 25 }, { width: 25 }, { width: 25 }];
  ws['!cols'] = wscols;
  const workbook: XLSX.WorkBook = { Sheets: { 'Journal': ws }, SheetNames: ['Journal'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true });

  const d = new Date();
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const fecha = d.getDate() + '_' + months[d.getMonth()] + '_' + d.getFullYear();

  this.saveAsExcelFile(excelBuffer, 'Auditoria_' + fecha);
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

