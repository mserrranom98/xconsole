import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import {ListaInstrumento, InstrumentosFiltros, FiltroIndustria, FiltroIndustria2,
   ListaInstrumento2, ListaInstrumento3, ListaInstrumentoFull, EditarInstrumento,
   EditarAtributo} from '../instrumentos/instrumentos.model';
import {InstrumentosService} from '../instrumentos/instrumentos.service';



import { NgbDateCustomParserFormatter } from 'app/pipes/date-format.pipe';

/*IMPORTS DEL MODAL*/
import { NgbDateParserFormatter, NgbDateStruct, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { EmpRexsService } from 'app/pages/pages-services/serv-emp-rec/emp-rexs.service';
import { RexSelect, SucSelect } from 'app/pages/pages-models/model-emp-rec';

import { ListasItems, Listas } from 'app/pages/pages-models/model-emp-serv-rec';
import { ListasService } from 'app/pages/pages-services/serv-emp-serv-rec/listas.services';
import { UtilsService } from 'app/pages/pages-services/serv-utils/utils.service';
import { GetUtils } from 'app/pages/pages-models/model-utils';


@Component({
    selector: 'app-instrumentos',
    templateUrl: './instrumentos.component.html',
    styles: [],
    styleUrls: ['./instrumentos.component.scss'],
    providers: [
      { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
    ]
   
  })

export class InstrumentosComponent implements OnInit {

 listainstrumentoFull: ListaInstrumentoFull;
 listaInstrumento: ListaInstrumento;
 listaInstrumento2: ListaInstrumento2;
 listaInstrumento3: ListaInstrumento3;
 editarInstrumento: EditarInstrumento;
 editarAtributo: EditarAtributo;

 instrumentoGlobal: string;

 filtroInstrumento: InstrumentosFiltros;
 listasItems:ListasItems;
 listas: Listas;
 ddListTipo = [];
 dddListTipo = [];
 opcI = new Object();
 data = [];
 dataAtrib = [];
 utils: GetUtils;
 listEps: any[];
 filtroind:FiltroIndustria;
 filtroind2:FiltroIndustria2;
 listEps2 :any[]; 
 listEps3 :any[]; 
 listEPS4 :any[];

//Arrays respuestas para las tablas de los servicios(2) generalmente los SELECTS
dataFull = [];
rows = [];
rowsA=[];
rowsS=[];

selected = [];

//modal
closeResult: string;
msj = '';
today = '';
visible = true;  

//flags
editarVaina = true;
editarVaina2=false;
noEditarIns = false;

atributoNormal = true;
editarAtri=false;

//Traer empresa
rexSelect: RexSelect;
listEmpRex: any[];


constructor(
        private instrumentosService: InstrumentosService,
        private utilsService: UtilsService,
        private listasService: ListasService,
        //MODAL
        private modalService: NgbModal,

        //Empresas
        private empRexsService: EmpRexsService,
       
    )
    {
        //Para traer empresa
         this.rexSelect = new RexSelect('', '');

        this.listas = new Listas('','','');
        this.listainstrumentoFull = new ListaInstrumentoFull('','','','','','');
        this.listasItems = new ListasItems('', '', '');
        this.filtroInstrumento = new InstrumentosFiltros('','','','','','');
        this.listaInstrumento = new ListaInstrumento('','','');
        this.listaInstrumento2 = new ListaInstrumento2('','','');
        this.listaInstrumento3 = new ListaInstrumento3('','','');
        this.editarInstrumento = new EditarInstrumento('','','','','','','','','','');
        this.editarAtributo = new EditarAtributo('','','','','','',0,'','','','','','','');
        this.utils = new GetUtils('', '');
        this.filtroind = new FiltroIndustria('');
        this.filtroind2 = new FiltroIndustria2('');
       
    }
  
    ngOnInit() {
      this.listaInstrumento.codigo='';
      this.instrumentosService.getTipoIndustria(this.listaInstrumento).subscribe(
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
       
    //Empresas todas
    this.empRexsService.getRex(this.rexSelect).subscribe(
      (response:any) => {
        this.listEmpRex = response.rexs;
        console.log(this.listEmpRex + "Estos son las empresas");
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
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

  // Interaccion
  this.listasItems.lista = 'INTEMP';
  this.listasService.getListasDet(this.listasItems).subscribe(
    (response:any) => {
      const dir = response.items.length;
      for (let i = 0; i < dir; i++) {
        const opc: Object = {
          id: response.items[i].item,
          itemName: response.items[i].glosa
        }
        this.dddListTipo[i] = opc;
      }
    },
    error => {
      console.log('Error: ' + JSON.stringify(error));
    }
  )

  //LISTAS
  this.listas.adm = '1';
  this.listasService.getListas(this.listas).subscribe(
    (response:any) =>{
      if(response.code != "0" ){         
          swal('instrumentos','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
          $('#loading').css('display', 'none');
      }else{
         
            this.rowsS = response.listas;
             console.log(this.rowsS + " lllaaaass listaaaaaaaas");

         }
  }
  )


        
    }

    buscar(){
       
        this.opcI = new Object();
        let codigo=0;  
       
        this.filtroInstrumento = new InstrumentosFiltros('','','','','','');


        this.filtroInstrumento.tipo = this.listainstrumentoFull.tipo;
        this.filtroInstrumento.bloqueado = this.listainstrumentoFull.bloqueado;
        this.filtroInstrumento.empresa = this.listainstrumentoFull.empresa;
        this.filtroInstrumento.interaccion = this.listainstrumentoFull.standIn;


        if(this.filtroInstrumento.empresa.length == 0)
        {
          swal(

            {
            title: '¿Desea buscar sin parametro empresa?, No podrá editar... ',
            type: 'warning',
            text: '',
            confirmButtonColor: '#0CC27E',
            cancelButtonColor: '#FF586B',
            confirmButtonText: 'OK',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            }
    
          ).then((result) => { //aquí se va a eliminar llamando al servicio
            if (result.value) {
  
              this.instrumentosService.getInstrumentos(this.listainstrumentoFull).subscribe(
                (response:any) => {
                    if(response.code != "0" ){         
                        swal('instrumentos','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
                        $('#loading').css('display', 'none');
                    }else{
                       
                          this.dataFull = response.instrumentos;
                           console.log(this.dataFull + "esto es");
                           this.rows = this.dataFull;
                       }
                }
              )
  
            } else {
              swal('Instrumentos', 'No se ha podido hacer la busqueda', 'warning');
            }
          });

          this.noEditarIns = false;
        }else{
          this.instrumentosService.getInstrumentos(this.listainstrumentoFull).subscribe(
            (response:any) => {
                if(response.code != "0" ){         
                    swal('instrumentos','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
                    $('#loading').css('display', 'none');
                }else{
                   
                      this.dataFull = response.instrumentos;
                       console.log(this.dataFull + "esto es");
                       this.rows = this.dataFull;
                   }
            }
          )

          this.noEditarIns = true;
         }
        



        


    
      /*  this.instrumentosService.getInstrumentos(this.listainstrumentoFull).subscribe(
            (response:any) => {codigo = parseInt(response.code);
                if(codigo !== 0 ){         
                    swal('Instrumentos','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
                    $('#loading').css('display', 'none');
                }else{
                  const dir = response.instrumentos.length;
                  for (let i = 0; i < dir; i++) {
                    this.opcI = {
                      instrumento: response.instrumentos[i].instrumento,
                      titulo: response.instrumentos[i].titulo,
                      tipo: response.instrumentos[i].tipo,
                      empresa: response.instrumentos[i].empresa,    
                      empresadesc: response.instrumentos[i].empresadesc,                   
                      accesoAlternativo:response.instrumentos[i].accesoAlternativo,
                      archivoNeg:response.instrumentos[i].archivoNeg,
                      bloqueado:response.instrumentos[i].bloqueado,
                      cartera:response.instrumentos[i].cartera,
                      codigoBarraEpsPos:response.instrumentos[i].codigoBarraEpsPos,
                      codigoBarraEpsValor:response.instrumentos[i].codigoBarraEpsValor,
                      codigoBarraXcash:response.instrumentos[i].codigoBarraXcash,
                      control:response.instrumentos[i].control,
                      digitoVerificadorPos:response.instrumentos[i].digitoVerificadorPos,
                      empCodigoBarraEpsPos:response.instrumentos[i].empCodigoBarraEpsPos,
                      empCodigoBarraEpsValor:response.instrumentos[i].empCodigoBarraEpsValor,                     
                      saf:response.instrumentos[i].saf,
                      standIn:response.instrumentos[i].standIn                     
                    }
                    this.dataFull[i] = this.opcI;
                  }
                      
              
                   }
                   this.rows = this.dataFull;
                  
            
            }
        ) */
        
    } 

    getIndustria(){
      this.listEps3=[];
      this.listaInstrumento.codigo=this.filtroind.lista;
      console.log(this.filtroind.lista);
      this.instrumentosService.getIndustria(this.listaInstrumento).subscribe(
        (response:any) => {
          const dir = response.rowCount;
          if (dir > 0) {
            this.listEps2 = response.rows;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }


    

    getEmpresa(){
      this.listaInstrumento2.codigo=this.filtroind2.lista;
      console.log(this.filtroind2.lista);
      this.instrumentosService.getEmpresa(this.listaInstrumento2).subscribe(
        (response:any) => {
          const dir = response.rowCount;
          if (dir > 0) {
            this.listEps3 = response.rows;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }



      /* Aquí Empieza el MODAL ATRIBUTO */


      atributos(rowIndex){
        const obj = this.rows[rowIndex];  
        console.log(rowIndex);
        //Me trae la posicion de la tabla

      const instrAtri = obj['instrumento'].toString();  
      this.instrumentoGlobal = instrAtri;
      console.log(instrAtri); 
      //Me trae el codigo del Instrumento!
        
      let code=0;  

        this.listaInstrumento3.instrumento = this.instrumentoGlobal;

          this.instrumentosService.getAtributo(this.listaInstrumento3).subscribe(
            (response:any) => {code = parseInt(response.code);
                if(code !== 0 ){         
                    swal('Atributos','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
                    $('#loading').css('display', 'none');
                }else{
                  
                      this.dataAtrib = response.rows;
                      console.log(this.dataAtrib);
                  }   
                  this.rowsA = this.dataAtrib; //Ya se le asignó rows a instrumentos, por lo que la tabla no entiende nada!
            }
        )
        
      }

     open(content, rowIndex) {
      
      this.atributos(rowIndex);

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








    /*
    En esta sección empiezan las funciones de editar instrumentos

    editar() 
      -->Recibirá el parametro de la posición de la tabla [X]
      -->Ocultará la zona de busqueda y mostrará la zona para editar [X]
      -->Revisará que el index de la tabla sea el correcto junto a sus datos, tal como en la busqueda de atributos [X]
      -->Pasará los datos del row seleccionado a los inputs correspondientes para ser editados [X]

    onEditar()
      -->Llamará al servicio de guardado de información [X]
    
    volverEditarInstrumento()
      -->Ocultará el formulario de edición y mostrará la busqueda [X]
    */

    editar(rowIndex){
      this.editarVaina = false;
      this.editarVaina2 = true;

      //Traer la posicion de la tabla
      const obj = this.rows[rowIndex];  
      console.log(rowIndex);

      //Traer información del row
      this.editarInstrumento.instrumento = obj['instrumento'].toString();  //Aquí estoy asignando el valor instrumento del row a una variable
      this.editarInstrumento.titulo = obj['titulo'].toString(); 
      this.editarInstrumento.tipo = obj['tipo'].toString(); 
      this.editarInstrumento.empresa = obj['empresa'].toString(); 
      this.editarInstrumento.bloqueado = obj['bloqueado'].toString(); 
      this.editarInstrumento.control = obj['control'].toString(); 
      this.editarInstrumento.saf = obj['saf'].toString(); 
      this.editarInstrumento.standIn = obj['standIn'].toString(); 

      
    }

    onEditar(){

      this.instrumentosService.getEditInstrumento(this.editarInstrumento).subscribe(
        (response :any) => {

          if (response.code === '0') {
            swal('Instrumento', 'Registro Editado con Exito', 'success');
          } else {
            swal('Instrumento', response.description + '. Verifique Información', 'error');
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )


      this.volverEditarInstrumento();
    
    }

    volverEditarInstrumento(){
      this.editarVaina=true;
      this.editarVaina2=false;

      this.buscar();
    }

    /*Fin de funciones para edición de instrumentos*/
    
    //-------------------------------------------------------------------------------------------------------------------------------//
    
    /*
    En esta sección empiezan las funciones de editar Atributos

    editarAtrib() 
      -->Recibirá el parametro de la posición de la tabla [X]
      -->Ocultará la zona de busqueda y mostrará la zona para editar [X]
      -->Revisará que el index de la tabla sea el correcto junto a sus datos, tal como en la busqueda de atributos [X]
      -->Pasará los datos del row seleccionado a los inputs correspondientes para ser editados [X]

    onEditarAtrib()
      -->Llamará al servicio de guardado de información [X]
    
    volverEditarAtributo()
      -->Ocultará el formulario de edición y mostrará la busqueda [X]
    */

   editarAtrib(rowIndex){
    this.atributoNormal = false;
    this.editarAtri = true;

    //Traer la posicion de la tabla
    const obj = this.rowsA[rowIndex];  
    console.log(rowIndex);

     
    //Traer información del row
    
    this.editarAtributo.instrumento = this.instrumentoGlobal; 
    /*console.log( this.editarAtributo.instrumento + "la que deberia ir al servicio");*/

    this.editarAtributo.atributo = obj['atributo'].toString();
    this.editarAtributo.largoMax = obj['largoMax'].toString();
    console.log(this.editarAtributo.largoMax + "  Este es el LARGO MAX");
    this.editarAtributo.llave = obj['llave'].toString();
    this.editarAtributo.tipo = obj['tipo'].toString();
    this.editarAtributo.titulo = obj['titulo'].toString();
    this.editarAtributo.visible = obj['visible'].toString();
    this.editarAtributo.orden = obj['orden'].toString();
    console.log(this.editarAtributo.orden + "  Este es el orden");
    this.editarAtributo.protegido = obj['protegido'].toString();
    this.editarAtributo.lista = obj['lista'].toString();
    this.editarAtributo.opcional = obj['opcional'].toString();
    this.editarAtributo.ordenImpresionTicket = obj['ordenImpresionTicket'].toString();
    console.log(this.editarAtributo.ordenImpresionTicket + "  Este es el ordenIMP");

  }

  onEditarAtrib(){

    console.log(this.editarAtributo.largoMax + " SE VA A ENVIAR ESTA WEA A LARGO MAX");

    console.log(this.editarAtributo.ordenImpresionTicket + " SE VA A ENVIAR ESTA WEA A ORDEN DIUCA");

    this.instrumentosService.getEditAtributo(this.editarAtributo).subscribe(
      (response :any) => {

        if (response.code === '0') {
          swal('Atributo', 'Registro Editado con Exito', 'success');
        } else {
          swal('Atributo', response.description + '. Verifique Información', 'error');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )

    this.volverEditarAtributo();

  

  }

  volverEditarAtributo(){
    this.atributoNormal = true;
    this.editarAtri = false;
  }

  actualizarWea(){
    let code=0;  

        this.listaInstrumento3.instrumento = this.instrumentoGlobal;

          this.instrumentosService.getAtributo(this.listaInstrumento3).subscribe(
            (response:any) => {code = parseInt(response.code);
                if(code !== 0 ){         
                    swal('Atributos','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
                    $('#loading').css('display', 'none');
                }else{
                  
                      this.dataAtrib = response.rows;
                      console.log(this.dataAtrib);
                  }   
                  this.rowsA = this.dataAtrib; //Ya se le asignó rows a instrumentos, por lo que la tabla no entiende nada!
            }
        )
  }



  /*Fin de funciones para edición de atributos*/

}
