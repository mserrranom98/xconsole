import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbDateStruct, NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { BitSelect, BitLevel1, BitLevel2 } from '../../pages-models/model-global';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NgbDateCustomParserFormatter } from '../../../pipes/date-format.pipe';
import { Router } from '@angular/router';
import { BitacoraService } from '../../pages-services/serv-reca/bitacora.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class BitacoraComponent implements OnInit {
  @Output() datos = new EventEmitter();
  @ViewChild('frmAut') f: NgForm;
  fechaIni: NgbDateStruct;
  fechaFin: NgbDateStruct;
  msjFecha: string;
  bitSelect: BitSelect;
  bitLevel1: BitLevel1;
  bitLevel2: BitLevel2;
  fInicial = '';
  fFinal = '';
  @ViewChild('table') table: any;
  data = [];
  rows: any[] = [];
  columns = [];
  temp = [];
  opc = new Object();
  @ViewChild('tableII') tableII: any;
  dataII = [];
  rowsII: any[] = [];
  columnsII = [];
  opcII = new Object();
  modules = [];
  objects = [];
  userNames = [];
  disabled = true;
  closeResult: string;
  divLevelI = false;
  rowIIDetalle = [];
  index = '';
  msj = '';
  constructor(
    private bitacoraService: BitacoraService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.bitSelect = new BitSelect('', '', '', '');
    this.bitLevel1 = new BitLevel1('', '', '', '', '', '');
    this.bitLevel2 = new BitLevel2('', '', '', '');
  }
  ngOnInit() {
  }
  toggleExpandRow(row) {
  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  filter() {
    this.msjFecha = '';
    this.divLevelI = false;
    this.validar();
    if (this.fechaIni !== undefined && this.fechaFin !== undefined) {
      this.fInicial = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day + ' 00:00:00';
      this.fFinal = this.fechaFin.year + '-' + this.fechaFin.month + '-' + this.fechaFin.day + ' 23:59:59';
    }
    if (this.validar() === true) {
      this.bitSelect.startDate = this.fInicial;
      this.bitSelect.endDate = this.fFinal;
      this.bitLevel1.startDate = this.fInicial;
      this.bitLevel1.endDate = this.fFinal;
      this.bitLevel2.startDate = this.fInicial;
      this.bitLevel2.endDate = this.fFinal;
      this.bitacoraService.getBitacora(this.bitSelect).subscribe(
        (response:any) => {
          if (response.code === '0') {
            this.modules = response.modules;
            this.objects = response.objects;
            this.userNames = response.userNames;
            this.disabled = false;
          }
        },
        error =>{
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }
  changeFilter() {
    this.msjFecha = '';
    this.divLevelI = false;
    if (this.fechaIni !== undefined && this.fechaFin !== undefined) {
      this.fInicial = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day + ' 00:00:00';
      this.fFinal = this.fechaFin.year + '-' + this.fechaFin.month + '-' + this.fechaFin.day + ' 23:59:59';
    }
    this.bitSelect.startDate = this.fInicial;
    this.bitSelect.endDate = this.fFinal;
    this.bitLevel1.startDate = this.fInicial;
    this.bitLevel1.endDate = this.fFinal;
    this.bitLevel2.startDate = this.fInicial;
    this.bitLevel2.endDate = this.fFinal;
  }
  levelI() {
    this.data = [];
    this.dataII = [];
    this.validar();
    if (this.validar() === true) {
      console.log(JSON.stringify(this.bitLevel1));
      this.bitacoraService.getNivel1(this.bitLevel1).subscribe(
        (response:any) => {
          const dir = response.rowCount;
          if (dir > 0) {
            this.msj = '';
            for (let i = 0; i < dir; i++) {
              this.opc = {
                birth: response.rows[i].birth,
                caller: response.rows[i].caller,
                id: response.rows[i].id,
                module: response.rows[i].module,
                object: response.rows[i].object,
                userName: response.rows[i].userName
              }
              this.data[i] = this.opc;
              this.divLevelI = true;
            }
            this.rows = this.data;
            this.temp = this.data;
          } else {
            this.msj ='No hay resultados.'
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }
  levelII(row) {
    this.rowsII = [];
    this.dataII = [];
    this.rowIIDetalle = row;
    this.bitLevel2.id = row.id;
    this.bitacoraService.getNivel2(this.bitLevel2).subscribe(
      (response:any) => {
        for (let i = 0; i < response.rowCount; i++) {
          this.opcII = {
            action: response.rows[i].action,
            eventDate: response.rows[i].eventDate,
            state: response.rows[i].state
          }
          this.dataII[i] = this.opcII;
        }
        this.rowsII = this.dataII;
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
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
  open(content) {
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
  exportar() {
    const json = JSON.parse(JSON.stringify(this.rowIIDetalle));
    const ws = XLSX.utils.aoa_to_sheet([
      ['BANCO CONSORCIO'],
      ['INFORME DE AUDITORIA'],
      [],
      ['Caller: ' + json['caller'], 'Module: ' + json['module'], 'Object: ' + json['object'], , 'User Name: ' + json['userName']]
    ]);
    const header = ['action', 'eventDate', 'state'];
    XLSX.utils.sheet_add_json(ws, this.dataII, { header: header, origin: 'B7' });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Auditoria');
    const wscols = [{ width: 18 }, { width: 18 }, { width: 25 }, { width: 25 }, { width: 25 }];
    ws['!cols'] = wscols;
    const workbook: XLSX.WorkBook = { Sheets: { 'Auditoria': ws }, SheetNames: ['Auditoria'] };
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
