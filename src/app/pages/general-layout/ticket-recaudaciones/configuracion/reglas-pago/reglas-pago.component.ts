import { Component, OnInit, ViewChild } from '@angular/core';
import { RegPagoSelect, RegPagoInsert, RegPagoDelete } from '../../../../pages-models/model-general';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ReglasPagoService } from '../../../../pages-services/serv-general/reglas-pago.service';
import { GetUtils } from '../../../../pages-models/model-utils';
import { UtilsService } from '../../../../pages-services/serv-utils/utils.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { CompareJson } from '../../../../../pipes/compare-json.pipe';

@Component({
  selector: 'app-reglas-pago',
  templateUrl: './reglas-pago.component.html',
  styles: [],
  styleUrls: ['./reglas-pago.component.scss']
})
export class ReglasPagoComponent implements OnInit {
  regPagoSelect: RegPagoSelect;
  datos = new Object();
  datosCodigos = [];
  datosInsert = [];
  msj = '';
  regPagoInsert: RegPagoInsert;
  itemList: any = [];
  listaMedPago = [];
  settings = {};
  medioPago: GetUtils;
  msjAddRegla = '';
  divAddRegla = false;
  cant = '1';
  // selected = [];
  datosDelete = [];
  regPagoDelete: RegPagoDelete;
  msjModal = '';
  closeResult: string;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any[] = [];
  divList = false;

  constructor(
    private reglasPagoService: ReglasPagoService,
    private utilsService: UtilsService,
  //  private compareJson: CompareJson,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.regPagoSelect = new RegPagoSelect('', '');
    this.regPagoInsert = new RegPagoInsert('', '', '', '');
    // this.regPagoInsert = new RegPagoInsert('', '', [{ codigo: '' }]);
    this.regPagoDelete = new RegPagoDelete('', '', '');
    this.medioPago = new GetUtils('', '');
  }

  ngOnInit() {
    this.buscar();
  }

  listMediosPago() {
    this.utilsService.getMedioPago(this.medioPago).subscribe(
      (response:any) => {
        if (response.rowCount > 0) {
          for (let i = 0; i < response.rowCount; i++) {
            let mp: Object = {
              codigo: response.rows[i].codigo,
              glosa: response.rows[i].titulo
            };
            this.itemList[i] = mp;
          }
          this.settings = {
            singleSelection: false,
            text: 'Seleccione...',
            selectAllText: 'Seleccione todo',
            unSelectAllText: 'Deseleccione todo',
            classes: 'myclass custom-class',
            primaryKey: 'codigo',
            labelKey: 'glosa',
            noDataLabel: 'Buscar medios de pago',
            enableSearchFilter: true,
            badgeShowLimit: 3,
            searchBy: ['glosa'],
            searchPlaceholderText: 'Buscar'
          }
        } else {
          this.msj = 'No hay resultados.';
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  buscar() {
    this.datosCodigos = [];
    $('#loading').css('display', 'block');
    this.reglasPagoService.getReglasPago(this.regPagoSelect).subscribe(
      (response:any) => {
        if (response.rowCount > 0) {
          for (let i = 0; i < response.rowCount; i++) {
            let numEmpDesc = '';
            if (response.rows[i].numeroEmpresas === '1') {
              numEmpDesc = 'Una';
            } else {
              numEmpDesc = 'Una o más';
            }
            if (response.rows[i].rowCount > 0) {
              let medPago = '';
              let cmp = [];
              for (let j = 0; j < response.rows[i].rowCount; j++) {
                if (medPago === '') {
                  medPago = response.rows[i].rows[j].glosa;
                } else {
                  medPago = medPago + ' - ' + response.rows[i].rows[j].glosa;
                }
                let codMP: Object = {
                  codigo: response.rows[i].rows[j].codigo
                }
                cmp[j] = codMP;
              }
              this.datos = {
                numeroEmpresasDesc: numEmpDesc,
                regla: response.rows[i].regla,
                mediosPago: medPago
              }
              let dc: Object = {
                numeroEmpresas: response.rows[i].numeroEmpresas,
                rows: cmp
              }
              this.datosCodigos[i] = dc;
            }
            this.divList = true;
            this.rows[i] = this.datos;
          }
          /* this.rows = this.rows.sort(function (a, b) {
             if (a.mediosPago > b.mediosPago) {
               return 1;
             }
             if (a.mediosPago < b.mediosPago) {
               return -1;
             }
             // a must be equal to b
             return 0;
           }); */
          $('#loading').css('display', 'none');
        } else {
          this.msj = 'No hay resultados.';
          $('#loading').css('display', 'none');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  nuevaRegla() {
    this.listMediosPago();
    this.divAddRegla = true;
  }

  addRegla() {
    this.datosInsert = [];
    if (this.validar()) {
      this.listaMedPago = this.listaMedPago.sort(function (a, b) {
        if (a.titulo > b.titulo) {
          return 1;
        }
        if (a.titulo < b.titulo) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
     // let cmp = [];
      let codMP = '';
      for (let i = 0; i < this.listaMedPago.length; i++) {
        if(codMP === ''){
          codMP = this.listaMedPago[i].codigo;
        } else {
          codMP = codMP + "-" + this.listaMedPago[i].codigo;
        }
        
       /* let codMP: Object = {
          codigo: this.listaMedPago[i].codigo
        }
        cmp[i] = codMP; */
      }
      let di: Object = {
        numeroEmpresas: this.cant,
        mediosPago: codMP
       // rows: cmp
      }
      this.datosInsert[0] = di;
     /* let changes = this.compareJson.getChanges(this.datosCodigos, this.datosInsert);

      if (changes.length === 0) {
        this.msjAddRegla = 'La regla ya existe.';
      } else { */
        this.regPagoInsert.numeroEmpresas = this.datosInsert[0].numeroEmpresas;
       // this.regPagoInsert.rows = this.datosInsert[0].rows;
       this.regPagoInsert.mediosPago = this.datosInsert[0].mediosPago;
        this.reglasPagoService.insertReglasPago(this.regPagoInsert).subscribe(
          (response:any) => {
            if (response.code === '0') {
              swal('Reglas de Pago', 'Registro guardado con éxito', 'success');
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.router.navigate(['/general/ticketrecaudacion/configuracion/reglasPago']));
            } else {
              swal('Reglas de Pago', response.description, 'error');
            }
          },
          error => {
            console.log('Error: ' + JSON.stringify(error));
          }
        )
     // }
    }
  }

  validar() {
    if (this.listaMedPago.length == 0) {
      this.msjAddRegla = 'Debe indicar el medio de pago.';
      return false;
    }
    return true;
  }

  cancelAddRegla() {
    this.divAddRegla = false;
    this.regPagoInsert.numeroEmpresas = '1';
    this.listaMedPago = [];
  }

  /* onSelect({ selected }) {
     this.selected.splice(0, this.selected.length);
     this.selected.push(...selected); 
     this.datosDelete = [];
     if(this.selected.length > 0){
       for(let i=0; i < this.selected.length; i++){
         let reg: Object = {
           regla: this.selected[i].regla
         };
         this.datosDelete[i] = reg; 
       }      
     }
     console.log('datos: ' + JSON.stringify(this.datosDelete));
   } */

  open(content, rowIndex) {
    this.regPagoDelete.regla = this.rows[rowIndex].regla;
    this.msjModal = '¿Está seguro que quiere borrar la regla N°: ' + this.regPagoDelete.regla + '?';
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

  deleteRegla() {
    this.reglasPagoService.deleteReglasPago(this.regPagoDelete).subscribe(
      (response:any) => {
        if (response.code === '0') {
          swal('Reglas de Pago', 'Registro borrado con éxito', 'success');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/general/ticketrecaudacion/configuracion/reglasPago']));
        } else {
          swal('Reglas de Pago', response.description, 'error');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
    /* if(this.datosDelete.length > 0){
       let count = 0;
       for(let i=0; i < this.datosDelete.length; i++){
         count++;
         this.regPagoDelete.regla = this.datosDelete[i].regla;
         this.reglasPagoService.deleteReglasPago(this.regPagoDelete).subscribe(
           response => { console.log('response.code: ' + response.code);
             if (response.code === '0') {
               this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
               this.router.navigate(['/general/ticketrecaudacion/configuracion/reglasPago']));            
             } else {
               this.msj = 'Error al borrar la regla. Por favor, intente de nuevo.';
             }
           },
           error => {
             console.log('Error: ' + JSON.stringify(error));
           }
         )
       }
     } */
  }
}
