import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Injectable, ViewChild} from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter} from '../../../../pipes/date-format.pipe';

import {MatTreeNestedDataSource} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import { SucSelect, RexSelect } from '../../../pages-models/model-emp-rec';
import { EmpRexsService } from '../../../pages-services/serv-emp-rec/emp-rexs.service';
import { SucursalesService } from '../../../pages-services/serv-emp-rec/sucursales.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { ArqueoSelect, ExportArqueo } from './model-arqueo';
import { ArqueoService } from './arqueo.service';
import {DatePipe} from '@angular/common';
import { VARGLOBAL } from '../../../../services/login-pass.service';
//BOTON
//import {ExcelService} from './services/excel.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TerminalesComponent } from 'app/pages/emp-reca-layout/configuracion/terminales/terminales.component';



export class FileNode { 
    hijo: FileNode[];
    glosa: string;
    valor: any; 
  }

 
  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const EXCEL_EXTENSION = '.xlsx';
  
  
@Component({
  selector: 'app-arqueo',
  templateUrl: './arqueo.component.html',
  styles: [],
  styleUrls: ['./arqueo.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})

export class ArqueoComponent  {

    vistaPrevia= false;
    visible = false;  
    arqueoExport:ExportArqueo;
    arqueo:ArqueoSelect;
    sucSelect: SucSelect;
    fechaIni: NgbDateStruct;   
    rexSelect: RexSelect;
    listEmpRex: any[];
    listSuc: any[];   
    datos: any[];    
    datosArqueo : any;
    sucDesc = '';   
   nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;
  dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);
//modal
closeResult: string;
opc = new Object();
data = [];
rows: any[] = [];
msj = '';
today = '';

  constructor(
    public datepipe: DatePipe,        
    private empRexsService: EmpRexsService,
    private sucursalesService: SucursalesService,
    private arqueoService: ArqueoService,   
    private route: ActivatedRoute,
    //MODAL
    private modalService: NgbModal
  ) {
     
    this.rexSelect = new RexSelect('', '');
    this.sucSelect = new SucSelect('', '', '');
    this.arqueo= new ArqueoSelect('','','','','');
    this.arqueoExport = new ExportArqueo ('','','','','');
   this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getHijo);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.dataChange.subscribe(data => this.nestedDataSource.data = data);
    this.dataChange.next([]);
  


}
 private _getHijo = (node: FileNode) => { return observableOf(node.hijo); };
  
 hasNestedChild = (_: number, nodeData: FileNode) => {return !(nodeData.valor); };

ngOnInit() {     
       
        this.empRexsService.getRex(this.rexSelect).subscribe(
          (response:any) => {
            this.listEmpRex = response.rexs; 
          //  console.log(JSON.stringify(this.listEmpRex));           
          })
        }

//MODAL
// Open default modal
open(content) {

  this.arqueoExport.empresarex=this.sucSelect.rex;
    this.arqueoExport.sucursal=this.arqueo.sucursal;     
    this.arqueoExport.userName = VARGLOBAL.user;
    this.arqueoExport.peticion = 'ARQUEO_REPORT';
    this.arqueoService.getArqueoFull(this.arqueoExport).subscribe(
      (responsea:any) => {
          //console.log(JSON.stringify(responsea.arqueoFull));          
          //this.exportarExcel(responsea.arqueoFull, 'arqueo');
          $('#loading').css('display', 'none');
          const dir = responsea.arqueoFull.length;
          if (dir > 0) {           
           for (let i = 0; i < dir; i++) {
              this.opc = {
                usuario: responsea.arqueoFull[i].a_Usuario,
                turno: responsea.arqueoFull[i].b_Turno,
                empresa: responsea.arqueoFull[i].c_Empresa,
                operacion: responsea.arqueoFull[i].d_Operacion,
                monto: responsea.arqueoFull[i].e_Monto
               
              }
              //console.log(this.opc);   
              this.data[i] = this.opc;
            }
            this.rows = this.data;           
            for(let i=0;i<=this.rows.length;i++){
              $('#tabla1').append('<tr>'); 
              $('#tabla1').append('<td scope="row">'+this.rows[i].usuario+'</td>');
              if(this.rows[i].turno!="" && this.rows[i].turno!=null){
                this.today  = this.formatoFechaHora(new Date(this.rows[i].turno));           
                $('#tabla1').append('<td>'+ this.today+'</td>');
              }else{
                $('#tabla1').append('<td>'+""+'</td>');
              }
              $('#tabla1').append('<td>'+this.rows[i].empresa+'</td>');
              $('#tabla1').append('<td>'+this.rows[i].operacion+'</td>');
              $('#tabla1').append('<td>'+this.rows[i].monto+'</td>');
              $('#tabla1').append('</tr>');
              this.vistaPrevia = true;            
              }
                 
          } else {
            this.msj = 'No hay resultados';            
          }
            
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )  
 
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


  sucursal() {
    this.listSuc = [];    
    //console.log(this.sucSelect.rex);
    this.sucursalesService.getSuc(this.sucSelect).subscribe(
      (response:any) => {
        this.listSuc = response.sucursales;
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  getDescSucursal(args) {
    this.sucDesc = args.target.options[args.target.selectedIndex].text;
  }  

  buscar() {       
    
      let codigo=0;
      this.arqueo.empresarex=this.sucSelect.rex;
      this.arqueo.sucursal=this.arqueo.sucursal;     
      this.arqueo.userName = VARGLOBAL.user;
      this.arqueo.peticion = 'ARQUEO_SELECT';
      this.arqueoService.getArqueo(this.arqueo).subscribe(
        (response:any) => {
           //console.log(JSON.stringify(response));   
          codigo = parseInt(response.code);          
          if(codigo !== 0 ){         
            //swal('Arqueo','Disculpe las molestias contactese con El Administrador :\n' + JSON.stringify(response.arqueo) , 'error');
            this.dataChange.next([response.arqueo]);  
            this.datos = response.arqueo;          
            $('#loading').css('display', 'block');
            this.visible=true;
         }
        
         
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )  
  }

  validaFecha() {
   // console.log('aaaaaa' + JSON.stringify(this.fechaIni));
    const fechaIni = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day;
    this.formatoFechaHora(new Date(fechaIni)),
   console.log('bbbbb' + JSON.stringify(this.fechaIni));
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
      mm = '0' +  1;
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

   // alert('Mes: '+ fecha.getFullYear()+ mm +dd);
    this.arqueo.fechacons= fecha.getFullYear()+ mm +dd;
    this.arqueoExport.fechacons= fecha.getFullYear()+ mm +dd;
    this.today=dd+mm+fecha.getFullYear();
    return dd + mm + fecha.getFullYear() ;
  }

  //Crear excel
  exportAsXLSX():void {
  
    this.arqueoExport.empresarex=this.sucSelect.rex;
    this.arqueoExport.sucursal=this.arqueo.sucursal;     
    this.arqueoExport.userName = VARGLOBAL.user;
    this.arqueoExport.peticion = 'ARQUEO_REPORT';
    this.arqueoService.getArqueoFull(this.arqueoExport).subscribe(
      (responsea:any) => {
          //console.log(JSON.stringify(responsea.arqueoFull));          
          this.exportarExcel(responsea.arqueoFull, 'arqueo');
          $('#loading').css('display', 'none');
           
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )  
   
  }

  printData()
  {
     let divToPrint=document.getElementById("reporte");
     let newWin= window.open("");
     newWin.document.write(divToPrint.outerHTML);
     newWin.print();
     newWin.close();
  }


  //SERVICIO DE EXCELL

  exportarExcel(json: any[], excelFileName: string):void{
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
   // console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string):void{
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

 
}