import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { OprLevelI } from '../../../../pages-models/model-general';
import { OperacionesService } from '../../../../pages-services/serv-general/operaciones.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgForm } from '@angular/forms';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { RexSelect, SucSelect, TerSelect } from '../../../../pages-models/model-emp-rec';
import { EmpRexsService } from '../../../../pages-services/serv-emp-rec/emp-rexs.service';
import { SucursalesService } from '../../../../pages-services/serv-emp-rec/sucursales.service';
import { TerminalesService } from '../../../../pages-services/serv-emp-rec/terminales.service';
import { UtilsService } from '../../../../pages-services/serv-utils/utils.service';
import { GetUtils } from '../../../../pages-models/model-utils';
import { ListasItems } from '../../../../pages-models/model-emp-serv-rec';
import { ListasService } from '../../../../pages-services/serv-emp-serv-rec/listas.services';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NgbDateCustomParserFormatter } from '../../../../../pipes/date-format.pipe';
import swal from 'sweetalert2';

/*IMPORTS DEL MODAL*/
import {  NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { OprLevelII, ResultI, OprLevelIII } from '../../../../pages-models/model-general';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})

export class OperacionesComponent implements OnInit {
  @ViewChild(DatatableComponent) tblList: DatatableComponent;
  @ViewChild('frmOpr') f: NgForm;
 // @Output() datos= new EventEmitter();

//del multiselect aweonao
disabled = false;
ShowFilter = false;
limitSelection = false;
selectedItems:any = [];



  fechaIni: NgbDateStruct;
  capa = false;
  rowsCapa = [];
  isCollapsed = false;
  fechaFin: NgbDateStruct;
  horaIni = '00:00:00';
  horaFin = '23:59:59';
  rexSelect: RexSelect;
  sucSelect: SucSelect;
  terSelect: TerSelect;
  listasItems: ListasItems;
  utils: GetUtils;
  listEmpRex: any[];
  divList = false;
  divSig = false;
  oprLevelI: OprLevelI;
  data = [];
  rows = [];
  temp = [];
  columns = [];
  msj = '';
  listSuc = [];
  listTer: any[];
  listEps: any[];
  listTipo = [];
  listEdo = [];
  listInst = [];
  listPago = [];
  opcI = new Object();
  opcP = new Object();
  dropdownList = [];
  ddListIns = [];
  ddListTipo = [];
  ddListEdo = [];
  ddListPag = [];
  dropdownSettings = {};
  msjFecha: string;
  selected = [];
  lisExport = [];
  

  //modal
closeResult: string;
today = '';
visible = true;
oprLevelII: OprLevelII;
resultI: ResultI;
opc = new Object();
sigDisable = false;
antDisable = false;
datao = [];
rows2 = [];
datos: OprLevelIII;
glosa = '';
folio='';
tipoglosa='';

  constructor(
    private empRexsService: EmpRexsService,
    private sucursalesService: SucursalesService,
    private operacionesService: OperacionesService,
    private terminalesService: TerminalesService,
    private utilsService: UtilsService,
    private listasService: ListasService,
    private router: Router,
    private route: ActivatedRoute,
    //MODAL
    private modalService: NgbModal
  ) {
    this.oprLevelII = new OprLevelII('', '', '', '', '');
    this.resultI = new ResultI('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
    this.datos = new OprLevelIII('', '', '', '', '', '', '');

    this.rexSelect = new RexSelect('', '');
    this.oprLevelI = new OprLevelI('', '', '', '', '', '', [], [], [], [], [], [], []);
    this.sucSelect = new SucSelect('', '', '');
    this.terSelect = new TerSelect('', '', '', '');
    this.utils = new GetUtils('', '');
    this.listasItems = new ListasItems('', '', '');
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Seleccione...',
      idField:'id',
      textField:'itemName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      allowSearchFilter: this.ShowFilter
    };

 /*   this.myForm = this.filtroBusqueda.group({
      city: [this.selectedItems]
  }); */
  
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

    // Medios de Pago
    let instrumentos = [];
    let pagos = [];
    this.utilsService.getInstrumentos(this.utils).subscribe(
      (response:any) => {
        const dir = response.rowCount;
        for (let i = 0; i < dir; i++) {
          if (response.rows[i].tipo === 'INGRES') {
            const opcI: Object = {
              id: response.rows[i].codigo,
              itemName: response.rows[i].titulo
            }
            instrumentos[i] = opcI
          } else {
            const opcP: Object = {
              id: response.rows[i].codigo,
              itemName: response.rows[i].titulo
            }
            pagos[i] = opcP;
          }
        }
        instrumentos = instrumentos.filter((i) => i !== null);
        pagos = pagos.filter((i) => i !== null);
        this.ddListIns = instrumentos;
        this.ddListPag = pagos;

      }
    )

    // Tipo
    this.listasItems.lista = 'OPETIP';
    this.listasService.getListasDet(this.listasItems).subscribe(
      (response:any) => {
        const dir = response.items.length;
        for (let i = 0; i < dir; i++) {
          const opc: Object = {
            id: response.items[i].item,
            itemName: response.items[i].glosa
          }
          this.ddListTipo[i] = opc;
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )

    // Estado
    this.listasItems.lista = 'OPEEST';
    this.listasService.getListasDet(this.listasItems).subscribe(
      (response:any) => {
        const dir = response.items.length;
        for (let i = 0; i < dir; i++) {
          const opc: Object = {
            id: response.items[i].item,
            itemName: response.items[i].glosa
          }
          this.ddListEdo[i] = opc;
         
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )

    this.selectedItems = [{id:0, itemName:'ANULADA'}];
    this.selectedItems = [{id:1, itemName:'DESCARTADA'}];








    // Empresas EPS
    this.utilsService.getEmpEps(this.utils).subscribe(
      (response:any) => {
        const dir = response.rowCount;
        if (dir > 0) {
          this.listEps = response.rows;
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )

    if (VAR_OPR.fdes !== '' && VAR_OPR.fhas !== '') {
      const date = new Date(VAR_OPR.fdes);
      this.fechaIni = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };

      const dateH = new Date(VAR_OPR.fhas);
      this.fechaFin = { year: dateH.getFullYear(), month: dateH.getMonth() + 1, day: dateH.getDate() };
      this.horaIni = VAR_OPR.hdes; // Hora desde
      this.horaFin = VAR_OPR.hhas; // Hora hasta

      this.oprLevelI.rex = VAR_OPR.rex; // Empresa Rex
      this.sucSelect.rex = VAR_OPR.rex; // Empresa Rex
      this.terSelect.rex = VAR_OPR.rex; // Empresa Rex

      this.oprLevelI.eps = VAR_OPR.eps; // Empresa Eps
      this.sucursal(); // Sucursal
      this.listSuc = VAR_OPR.suc;

      this.terminal(); // Terminal
      this.oprLevelI.terminalList = VAR_OPR.ter;

      // Tipo
      this.listTipo = VAR_OPR.tip;

      // Estado
      this.listEdo = VAR_OPR.est;

      // Instrumentos
      this.listInst = VAR_OPR.ins;

      // Medios de Pago
      this.listPago = VAR_OPR.mpag;

      // Realizar cambio de busqueda por parametros url
      // this.buscar();
      this.limpiarFiltros();
    }
    this.buscar()

  }
//para la wea del multiselect ctm
  onItemSelect(item: any){

    console.log('onItemSelect')

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

  sucursal() {
    this.listSuc = [];
    this.listTer = [];
    this.divList = false;
    this.sucursalesService.getSuc(this.sucSelect).subscribe(
      (response:any) => {
        if (response.code === '0') {
          const dir = response.sucursales.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.sucursales[i].sucursal,
              itemName: response.sucursales[i].descripcion
            }
            this.dropdownList[i] = opc;
          }
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  terminal() {
    const conTer = this.listSuc.length;
    if (conTer === 0) {
      this.listTer = [];
      this.oprLevelI = new OprLevelI('', '', this.oprLevelI.startDate, this.oprLevelI.endDate,
        this.oprLevelI.rex, this.oprLevelI.eps, [], [], this.oprLevelI.tipoList,
        this.oprLevelI.estadoList, this.oprLevelI.instrumentoList, this.oprLevelI.mpList, []);
    } else {
      this.listTer = [];
      this.divList = false;
      this.terSelect.sucursal = this.listSuc[0].id
      this.terminalesService.getTer(this.terSelect).subscribe(
        (response:any) => {
          this.listTer = response.terminales;
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }

  buscar() {
    this.validar();
    this.data = [];
    this.rows = [];
    this.temp = [];
    this.lisExport = [];
    if (this.listTipo.length === 0) {
      this.oprLevelI.tipoList = [];
    }
    if (this.listEdo.length === 0) {
      this.oprLevelI.estadoList = [];
    }
    if (this.listInst.length === 0) {
      this.oprLevelI.instrumentoList = [];
    }
    if (this.listPago.length === 0) {
      this.oprLevelI.mpList = [];
    }
    if (this.fechaIni !== undefined && this.fechaFin !== undefined) {
      this.oprLevelI.startDate = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day + ' ' + this.horaIni;
      this.oprLevelI.endDate = this.fechaFin.year + '-' + this.fechaFin.month + '-' + this.fechaFin.day + ' ' + this.horaFin;
    }

    if (this.validar() === true) {
      $('#loading').css('display', 'block');
      this.msj = '';
      // Lista de Sucursales
      for (let i = 0; i < this.listSuc.length; i++) {
        this.oprLevelI.sucursalList[i] = this.listSuc[i].id;
      }
      // Lista de Tipo
      for (let i = 0; i < this.listTipo.length; i++) {
        this.oprLevelI.tipoList[i] = this.listTipo[i].id;
      }
      // Lista de Estado
      for (let i = 0; i < this.listEdo.length; i++) {
        this.oprLevelI.estadoList[i] = this.listEdo[i].id;
      }
      // Lista de Instrumento
      for (let i = 0; i < this.listInst.length; i++) {
        this.oprLevelI.instrumentoList[i] = this.listInst[i].id;
      }
      // Lista de Medio de Pago
      for (let i = 0; i < this.listPago.length; i++) {
        this.oprLevelI.mpList[i] = this.listPago[i].id;
      }
      let codigo=0;  
      this.opcI = new Object();
      this.filtroBusqueda();
      this.operacionesService.getExportar(this.oprLevelI).subscribe(
        (response:any) => {
          codigo = parseInt(response.code);          
          if(codigo !== 0 ){         
            swal('Operaciones','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
            $('#loading').css('display', 'none');
         }else{
          if (response.rowCount !== '0') {
            for (let i = 0; i < response.rowCount; i++) {
              this.opcI = {
                Rex: response.rows[i].rexGlosa, 
                Sucursal: response.rows[i].sucursalGlosa,
                Terminal: response.rows[i].terminalGlosa,
                Usuario: response.rows[i].usuario, 
                Turno: response.rows[i].turno,
                Registro: response.rows[i].fechaRegistro,
                Recaudación: response.rows[i].fechaRecaudacion,
                Monto: parseInt(response.rows[i].monto, 10),
                Tipo: response.rows[i].tipoGlosa,
                Estado: response.rows[i].estadoGlosa,
                Folio: response.rows[i].folio,
                Detalle: response.rows[i].detalle
              }
              this.lisExport[i] = this.opcI;
            }
            this.isCollapsed = true;
            this.divList = true;
            this.data = response.rows;
            this.rows = this.data;
            //console.log(JSON.stringify(this.rows));
            this.temp = this.data;
            if (parseInt(response.rowCount, 10) === 150) {
              this.divSig = true;
            }
            $('#loading').css('display', 'none');
          } else {
            this.msj = 'No hay resultados';
            this.divList = false;
            $('#loading').css('display', 'none');
          }

         }
         
        }
      )
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

  filtroBusqueda() {
    this.limpiarFiltros();
    VAR_OPR.fdes = this.oprLevelI.startDate;
    VAR_OPR.fhas = this.oprLevelI.endDate;
    VAR_OPR.hdes = this.horaIni;
    VAR_OPR.hhas = this.horaFin;
    VAR_OPR.rex = this.oprLevelI.rex;
    VAR_OPR.eps = this.oprLevelI.eps;
    VAR_OPR.suc = this.listSuc;
    VAR_OPR.ter = this.oprLevelI.terminalList;
    VAR_OPR.tip = this.listTipo;
    VAR_OPR.est = this.listEdo;
    VAR_OPR.ins = this.listInst;
    VAR_OPR.mpag = this.listPago;
  }

  limpiarFiltros() {
    VAR_OPR.fdes = '';
    VAR_OPR.fhas = '';
    VAR_OPR.hdes = '';
    VAR_OPR.hhas = '';
    VAR_OPR.rex = '';
    VAR_OPR.eps = '';
    VAR_OPR.suc = [];
    VAR_OPR.ter = [];
    VAR_OPR.tip = [];
    VAR_OPR.est = [];
    VAR_OPR.ins = [];
    VAR_OPR.mpag = [];
  }

  public onToggleExpandGroup(group) {
    this.tblList.groupHeader.toggleExpandGroup(group);
  }

/*  onSelect(event) {
    this.capa = true;
    this.divList = false;
    this.rowsCapa = [];  
    this.rowsCapa[0] = this.selected[0];  
    this.datos.emit(JSON.stringify(this.rowsCapa));
    console.log(this.datos) ;  
  }*/

  siguiente() {
    this.oprLevelI.contexto = [];
    const i = this.rows.length - 1;
    this.oprLevelI.contexto = this.rows[i].contexto;
    this.rows = [];
    this.divList = false;
    $('#loading').css('display', 'block');
    this.operacionesService.getOperacionesI(this.oprLevelI).subscribe(
      (response:any) => {
        if (response.rowCount !== '0') {
          for (let j = 0; j < response.rowCount; j++) {
            this.data[this.data.length] = response.rows[j];
            this.opcI = {
              Rex: response.rows[j].rexGlosa,
              Sucursal: response.rows[j].sucursalGlosa,
              Terminal: response.rows[j].terminalGlosa,
              Usuario: response.rows[j].usuario,
              Turno: response.rows[j].turno,
              Registro: response.rows[j].fechaRegistro,
              Recaudación: response.rows[j].fechaRecaudacion,
              Monto: parseInt(response.rows[j].monto, 10),
              Tipo: response.rows[j].tipoGlosa,
              Estado: response.rows[j].estadoGlosa,
              Folio: response.rows[j].folio
            }
            this.lisExport[this.lisExport.length] = this.opcI;
          }
          this.rows = this.data;
          this.temp = this.data;
          $('#loading').css('display', 'none');
        } else {
          this.rows = this.temp;
          this.data = this.temp;
        }
        this.divList = true;
      }
    )

  }

exportar() { 

  this.validar();
  this.data = [];
  this.rows = [];
  this.temp = [];
  this.lisExport = [];


  if (this.listTipo.length === 0) {
    this.oprLevelI.tipoList = [];
  }
  if (this.listEdo.length === 0) {
    this.oprLevelI.estadoList = [];
  }
  if (this.listInst.length === 0) {
    this.oprLevelI.instrumentoList = [];
  }
  if (this.listPago.length === 0) {
    this.oprLevelI.mpList = [];
  }
  if (this.fechaIni !== undefined && this.fechaFin !== undefined) {
    this.oprLevelI.startDate = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day + ' ' + this.horaIni;
    this.oprLevelI.endDate = this.fechaFin.year + '-' + this.fechaFin.month + '-' + this.fechaFin.day + ' ' + this.horaFin;
  }

  if (this.validar() === true) {
    $('#loading').css('display', 'block');
    this.msj = '';
    // Lista de Sucursales
    for (let i = 0; i < this.listSuc.length; i++) {
      this.oprLevelI.sucursalList[i] = this.listSuc[i].id;
    }
    // Lista de Tipo
    for (let i = 0; i < this.listTipo.length; i++) {
      this.oprLevelI.tipoList[i] = this.listTipo[i].id;
    }
    // Lista de Estado
    for (let i = 0; i < this.listEdo.length; i++) {
      this.oprLevelI.estadoList[i] = this.listEdo[i].id;
    }
    // Lista de Instrumento
    for (let i = 0; i < this.listInst.length; i++) {
      this.oprLevelI.instrumentoList[i] = this.listInst[i].id;
    }
    // Lista de Medio de Pago
    for (let i = 0; i < this.listPago.length; i++) {
      this.oprLevelI.mpList[i] = this.listPago[i].id;
    }
    let codigo=0;  
    this.opcI = new Object();
    this.filtroBusqueda();


    this.operacionesService.getExportar(this.oprLevelI).subscribe(
      (response:any) => {
        codigo = parseInt(response.code);          
        if(codigo == 0 ){ 
          
          for (let i = 0; i < response.rowCount; i++) {
            this.opcI = {
              RexOO: response.rows[i].rexGlosa, 
              Sucursal: response.rows[i].sucursalGlosa,
              Terminal: response.rows[i].terminalGlosa,
              Usuario: response.rows[i].usuario, 
              Turno: response.rows[i].turno,
              Registro: response.rows[i].fechaRegistro,
              Recaudación: response.rows[i].fechaRecaudacion,
              Monto: parseInt(response.rows[i].monto, 10),
              Tipo: response.rows[i].tipoGlosa,
              Estado: response.rows[i].estadoGlosa,
              Folio: response.rows[i].folio,
              Detalle: response.rows[i].detalle
            }
            this.lisExport[i] = this.opcI;
            console.log(this.lisExport);
          }

          //Comienzo de exportación web excel
          const ws = XLSX.utils.aoa_to_sheet([
            ['BANCO CONSORCIO'],
            ['CONSULTA DE OPERACIONES'],
            [],
          ]);
                                        //Dato a pasar    //Donde empieza a poner la tabla
          XLSX.utils.sheet_add_json(ws, this.lisExport, { origin: 'B5' });

          //Donde crea el libro
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Operaciones');
      
          //Tamaño de las columnas
          const wscols = [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 },
          { width: 25 }, { width: 25 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }];
          ws['!cols'] = wscols;
      
          //no se para que sirve
          const workbook: XLSX.WorkBook = { Sheets: { 'Operaciones': ws }, SheetNames: ['Operaciones'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true });
      
          //aqui consigue la fecha en formato para dar el nombre
          const d = new Date();
          const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          const fecha = d.getDate() + '_' + months[d.getMonth()] + '_' + d.getFullYear();
      //Manda  a guardar con el nombre al final
          this.saveAsExcelFile(excelBuffer, 'Operaciones' + fecha);
          
          
          this.buscar();        
          swal('Operaciones','Ha sido correcta la exportación de operaciones :' , 'success');
          $('#loading').css('display', 'none');

       } else {
          this.msj = 'No hay resultados';
          this.divList = false;
          $('#loading').css('display', 'none');
        }

       }       
      
    )
   
  }


 /*
    const ws = XLSX.utils.aoa_to_sheet([
      ['BANCO CONSORCIO'],
      ['CONSULTA DE OPERACIONES'],
      [],
    ]);
    XLSX.utils.sheet_add_json(ws, this.lisExport, { origin: 'B5' });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Operaciones');

    const wscols = [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 },
    { width: 25 }, { width: 25 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }];
    ws['!cols'] = wscols;

    const workbook: XLSX.WorkBook = { Sheets: { 'Operaciones': ws }, SheetNames: ['Operaciones'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true });

    const d = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const fecha = d.getDate() + '_' + months[d.getMonth()] + '_' + d.getFullYear();

    this.saveAsExcelFile(excelBuffer, 'Operaciones' + fecha);
*/
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }


/**--------------------------------------------------------------------------------------------------------------- */
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**-------------------------------------------PANTALLA REMPLAZO --------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**----------------------------------------OPERACIONES DETALLES---------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**---------------------------------------------------------------------------------------------------------------*/
/**-----------------------------------------INICIO TRASPASO DE FUNCIOES-------------------------------------------*/

  open(content, event) {
    console.log(event);
    this.operacionDetalle(event,content);
    this.folio=event.selected[0].folio;
    this.tipoglosa=event.selected[0].tipoGlosa;
    //this.openModal(content);
  }

  openModal(content) {
    
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
  /*Aquí Terminan las funciones del MODAL */


  operacionDetalle(rowIndex,event){
  // console.log(JSON.stringify(rowIndex));
    this.oprLevelII.operacion = rowIndex.selected[0].operacion;
    this.oprLevelII.turno = rowIndex.selected[0].turno;
    this.oprLevelII.usuario = rowIndex.selected[0].usuario;
    
    console.log(JSON.stringify(this.oprLevelII)); 

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
              this.datao[i] = this.opc;
          }
          this.resultI.terminalGlosa = response.terminalGlosa;
          this.resultI.usuario = response.usuario;
          this.resultI.turno = response.turno;
          this.resultI.operacion = response.operacion;
          this.resultI.fechaRegistro = response.fecha;
          this.resultI.fechaRecaudacion = response.fecha;
          this.resultI.estado = response.estado;
          this.resultI.folio = response.folio;

          this.rows2 = this.datao;
          this.sigDisable = false;
          this.openModal(event);
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

  public open2(content2, rowIndex) {

    this.datos = new OprLevelIII('', '', '', '', '', '', '');

    this.datos.usuario = this.oprLevelII.usuario;
    
    this.datos.turno = this.oprLevelII.turno
    this.datos.operacion = this.oprLevelII.operacion 
    console.log(this.datos.operacion)
    this.datos.detalle = this.rows2[rowIndex].detalle;
    this.datos.instrumento = this.rows2[rowIndex].instrumento;
    console.log(this.datos.instrumento);
    this.glosa = this.rows2[rowIndex].instrumentoGlosa;
    console.log(this.glosa);



    this.modalService.open(content2, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }


  elSuscribe(){
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
              this.datao[i] = this.opc;
          }
          this.resultI.terminalGlosa = response.terminalGlosa;
          this.resultI.usuario = response.usuario;
          this.resultI.turno = response.turno;
          this.resultI.operacion = response.operacion;
          this.resultI.fechaRegistro = response.fecha;
          this.resultI.fechaRecaudacion = response.fecha;
          this.resultI.estado = response.estado;
          this.resultI.folio = response.folio;

          this.rows2 = this.datao;
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




  siguienteop() {
    this.datao = [];
    const sig = parseInt(this.oprLevelII.operacion, 10) + 1;
    this.oprLevelII.operacion = sig.toString();
    this.elSuscribe();
  }

  anteriorop() {
    this.datao = [];
    const sig = parseInt(this.oprLevelII.operacion, 10) - 1;
    this.oprLevelII.operacion = sig.toString();
    this.elSuscribe();
  }





}

export let VAR_OPR = {
  fdes: '',
  fhas: '',
  hdes: '',
  hhas: '',
  rex: '',
  eps: '',
  suc: [],
  ter: [],
  tip: [],
  est: [],
  ins: [],
  mpag: []
}
