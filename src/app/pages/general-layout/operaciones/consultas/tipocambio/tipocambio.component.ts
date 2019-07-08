import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {ObtenerTipoCambio , CrearTipoCambio, ActualizarTipoCambio, BorrarTipoCambio, ListaMoneda, CargaMasivaTipoCambio} from './tipocambio.model';
import {TipoCambioService} from './tipocambio.service'
import { NgbDateCustomParserFormatter } from 'app/pipes/date-format.pipe';



/*IMPORTS DEL MODAL*/
import { NgbDateParserFormatter, NgbDateStruct, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

const URL = 'http//:4200/CARGA/';

@Component({
  
    selector: 'app-tipoCambio',
    templateUrl: './tipocambio.component.html',
    styles: [],
    styleUrls: ['./tipocambio.component.scss'],
    providers: [
      { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
    ]
   
  })

export class TipoCambiocomponent implements OnInit{ 

    @ViewChild(DatatableComponent) tblList: DatatableComponent;
    @ViewChild('panel', { read: ElementRef }) public panel: ElementRef;
    @ViewChild('f') f: NgForm;
    @Output() datos = new EventEmitter();
    @Input() tipo: string;
    tipoB = '';
    leerTipoCAmbio: ObtenerTipoCambio;
    guardarTipoCAmbio: CrearTipoCambio;
    editarTipoCambio: ActualizarTipoCambio;
    borrarTipoCAmbio: BorrarTipoCambio;
    tipoMoneda: ListaMoneda;
    cargaMasiva:CargaMasivaTipoCambio;
    list = [];
    opc = new Object(); 
    data = []; 
    rows = [];
    temp = [];
    columns = [];
    selected = [];
    editing = {};
    divIU = false;
    disabled = false;
    divTipo = true;
    gestion = '';
    fechaIni: NgbDateStruct;
    fechaFin: NgbDateStruct;
    dataMoneda: [];
    glosar:any[];
    item:[];
    monedaSec:any;
    monedaValor:any;
    fechaIn ='';
    fechaOt ='';
    valida :any;
    archivo :any;

    //modal
  closeResult: string;
  msj = '';
  today = '';
  visible = true;  
  /*opc = new Object();
  data = [];
  rows: any[] = [];*/
  
    constructor(
      private tipocambioService: TipoCambioService,
      private router: Router,
      private route: ActivatedRoute,
      private formatoFecha:NgbDateCustomParserFormatter,

      //MODAL
      private modalService: NgbModal
    ) {
      this.data = [];
      this.leerTipoCAmbio = new ObtenerTipoCambio('', '', '','','');
      this.guardarTipoCAmbio = new CrearTipoCambio('', '', '', '','','');
      this.editarTipoCambio = new ActualizarTipoCambio('', '', '','','','','');
      this.borrarTipoCAmbio = new BorrarTipoCambio('','','');
      this.tipoMoneda = new ListaMoneda('','','',''); 
      this.cargaMasiva= new CargaMasivaTipoCambio('','','','');    
    }
  
    ngOnInit() {
          
      this.tipocambioService.getTipoMoneda(this.tipoMoneda).subscribe(
       (response:any) => {
            if(response.code=="6996"){         
              swal('ksjdhf', response.description + '. Verifique Servidor Netswitch', 'error');
          }else{  
                    //console.log(JSON.stringify(response)) ;                                   
                   this.glosar=response.items;  
                   console.log(this.glosar);
            
          }
       }
     )

   

    }
  
    changeListener($event) : void {
      this.readThis($event.target);
    }
    
    readThis(inputValue: any): void {
      var file:File = inputValue.files[0];
      var myReader:FileReader = new FileReader();
    
      myReader.onloadend = (e) => {
        this.archivo = myReader.result;        
      }
      myReader.readAsDataURL(file);
     
    }


    buscar() {
      // Consultar Lista
      
      this.opc = new Object();
      this.data = [];  
      //this.leerTipoCAmbio.moneda="UF";  
      //this.leerTipoCAmbio.fecha_desde="20190201";
      //this.leerTipoCAmbio.fecha_hasta="20190212";
      this.tipocambioService.getTipoCAmbio(this.leerTipoCAmbio).subscribe(
        (response : any) => { 
         /* console.log(JSON.stringify(response));*/
         if(response.code=="6996"){         
            swal('Tipo Cambio', response.description + '. Verifique Servidor Netswitch', 'error');
         }else{
          const dir = response.tipocambio.length;
          for (let i = 0; i < dir; i++) {
            this.opc = {
              fechaDesde: response.tipocambio[i].fecha_desde,
              fechaHasta: response.tipocambio[i].fecha_hasta,
              idtipoCambio: response.tipocambio[i].id,
              monedaTC: response.tipocambio[i].moneda,
              valorTC: response.tipocambio[i].valor
            }
            this.data[i] = this.opc;
          }
          this.rows = this.data;
          this.temp = this.data; 
         }        
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  
    nuevo() {      
      this.disabled = false;
      this.divIU = true;
      this.divTipo = false;
      this.gestion = 'nuevo';
    }
  
    onNuevo() {
      this.tipocambioService.postTipoCAmbio(this.guardarTipoCAmbio).subscribe(
        (response :any) => {
          if (response.code === '0') {
            swal('Tipo Cambio', 'Registro Creado con Exito', 'success');
            this.buscar();
          } else {
            swal('Tipo Cambio', response.description + '. Verifique Información', 'error');
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  
    onCancel() {
      this.limpiar();   
    }
  
    editar(rowIndex) {
     
      this.divIU = true;
      this.divTipo = false;   
      const obj = this.rows[rowIndex];  
    
      
      const fechaA = obj['fechaDesde'].toString();     
      const formateado = fechaA.substring(6,8)+'/'+fechaA.substring(4,6)+'/'+fechaA.substring(0,4);     
      this.fechaIni= this.formatoFecha.parse(formateado);


      const fechaB = obj['fechaHasta'].toString();
      const formateado2 = fechaB.substring(6,8)+'/'+fechaB.substring(4,6)+'/'+fechaB.substring(0,4);     
      this.fechaFin= this.formatoFecha.parse(formateado2);
      
      this.leerTipoCAmbio.moneda = obj['monedaTC'];
      this.guardarTipoCAmbio.valor = obj['valorTC'];     
      this.editarTipoCambio.id=obj['idtipoCambio'];      
      this.editarTipoCambio.moneda = obj['monedaTC'];
      this.editarTipoCambio.valor = obj['valorTC'];     
      this.gestion = 'actualizar';
     
      
    }
  
    onEditar() {
      this.tipocambioService.putTipoCAmbio(this.editarTipoCambio).subscribe(
        (response:any) => {
          if (response.code === '0') {
            swal('Tipo Cambio', 'Registro Actualizado con Exito', 'success');
            this.buscar();
          } else {
            swal('Tipo Cambio',' NO SE PUEDE MODIFICAR ESTE TIPO DE CAMBIO, POR QUE LA FECHA DE VIGENCIA ES MENOR A LA DE HOY', 'error');
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  
    guardar() {
      this.divIU = false;
      this.divTipo = true;
      if (this.gestion === 'nuevo') {
        this.onNuevo();
      } else {
        //this.validaFecha();
        this.onEditar();
      }
      this.limpiar();
    }
   
    eliminar(rowIndex) {
      const obj = this.rows[rowIndex];      
      this.borrarTipoCAmbio.id = obj['idtipoCambio'];     
      swal({
        title: 'Advertencia!',
        type: 'warning',
        text: '',
        confirmButtonColor: '#0CC27E',
        cancelButtonColor: '#FF586B',
        confirmButtonText: 'OK',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          this.tipocambioService.deleteTipoCAmbio(this.borrarTipoCAmbio).subscribe(
            (response:any) => {
              if (response.code === '0') {
                swal('Tipo Cambio', 'Registro Eliminado', 'success');
                this.buscar();
              } else {
                swal('Tipo Cambio', 'Registro No ha sido Eliminado', 'error');
              }
            },
            error => {
              console.log(<any>error);
            });
        } else {
          swal('Tipo Cambio', 'Registro No ha sido Eliminado', 'warning');
        }
      });
  
    }
  
    onSelect(rowIndex) {
      this.datos.emit(JSON.stringify(this.rows[rowIndex].idtipoCambio));     
    }
  
    limpiar() {
      this.divIU = false;
      this.divTipo = true;      
      this.fechaIni=null;
      this.fechaFin=null;
      this.monedaSec="";
      this.monedaValor="";
    }
  
   

    validaFecha(fecha,tipo) {
     let tipof = tipo;
       
      if(tipo=='in'){ 
        this.fechaIni = fecha;
        const fechaA = this.fechaIni.year+'-'+this.fechaIni.month+'-'+this.fechaIni.day;
        this.formatoFechaHora(new Date(fechaA),tipo);        
      }
      if(tipo=='out'){
        this.fechaFin = fecha;
        const fechaA = this.fechaFin.year+'-'+this.fechaFin.month+'-'+this.fechaFin.day;        
        this.formatoFechaHora(new Date(fechaA),tipo);
       
      }     
    }
    
      formatoFechaHora(fecha: Date,tipo): string {
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
        if (fecha.getMonth() < 10) {
          mm = '0' +(fecha.getMonth()+1);
        } else {
          mm = (fecha.getMonth()+1).toString()
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
       if(tipo=='in'){         
        this.leerTipoCAmbio.fecha_desde = fecha.getFullYear()+ mm +dd;
        this.guardarTipoCAmbio.fecha_desde= fecha.getFullYear()+ mm +dd;
        this.editarTipoCambio.fecha_desde= fecha.getFullYear()+ mm +dd;
        console.log(fecha.getFullYear()+ mm +dd);        
       }
       if(tipo=='out'){
        this.leerTipoCAmbio.fecha_hasta = fecha.getFullYear()+ mm +dd;
        this.guardarTipoCAmbio.fecha_hasta= fecha.getFullYear()+ mm +dd;
        this.editarTipoCambio.fecha_hasta=fecha.getFullYear()+ mm +dd;
        console.log(fecha.getFullYear()+ mm +dd);  
       }
       
      
        return dd + mm + fecha.getFullYear() ;
      }



      /* Aquí Empieza el MODAL

      Open default modal
      */


      open(content) {
      
        this.msj = '';
      
          this.tipocambioService.getIndicadores().subscribe(
            (responsea:any) => {
                //console.log(JSON.stringify(responsea));          
                //this.exportarExcel(responsea.arqueoFull, 'arqueo');
                $('#loading').css('display', 'none');
                $('#tabla1').append('<tr>'); 
                $('#tabla1').append('<th scope="row">'+responsea.uf.valor+'</th>');
                $('#tabla1').append('<td>'+responsea.dolar.valor+'</td>');
                $('#tabla1').append('<td>'+responsea.dolar_intercambio.valor+'</td>');
                $('#tabla1').append('<td>'+responsea.euro.valor+'</td>');
                $('#tabla1').append('<td>'+responsea.utm.valor+'</td>');
                $('#tabla1').append('<td>'+responsea.ivp.valor+'</td>');
                $('#tabla1').append('</tr>');   
                 console.log(JSON.stringify(this.rows));
            },
            error => {
              this.msj = 'Servicio no disponible';
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

      /*
      Aquí Terminan las funciones del MODAL
      */





     openCarga(content2) {

      this.modalService.open(content2, { size: 'lg' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

     }


     enviarArchivo(){
      this.cargaMasiva.archivo=this.archivo;
      this.cargaMasiva.moneda=this.leerTipoCAmbio.moneda; 
      this.tipocambioService.postArchivo(this.cargaMasiva).subscribe(
        
        (responsea:any) => {
         
          if(responsea.code=="91"){
            swal('Tipo Cambio', 'Error carga: '+' NO SE PUEDE CREAR ESTE TIPO DE CAMBIO, POR QUE LA FECHA DE VIGENCIA ES MENOR A LA DE HOY', 'error');
          }else{
            swal('Tipo Cambio', 'completada' ,'success');
          }
         
        },
        error => {
          this.msj = 'Servicio no disponible'+error;
          
        }
      )  

     }


} 