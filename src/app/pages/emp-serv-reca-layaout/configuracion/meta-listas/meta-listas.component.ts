import {Component, OnInit, ViewChild} from '@angular/core';
import {Listas, MetaListaDelete, MetaListaInsert, MetaListaSelect} from '../../../pages-models/model-emp-serv-rec';
import {MetaListasService} from '../../../pages-services/serv-emp-serv-rec/meta-listas.services';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {ListasService} from '../../../pages-services/serv-emp-serv-rec/listas.services';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meta-listas',
  templateUrl: './meta-listas.component.html',
  styleUrls: ['./meta-listas.component.scss']
})
export class MetaListasComponent implements OnInit {
  metaListaSelect: MetaListaSelect;
  metaListaInsert: MetaListaInsert;
  metaListaDelete: MetaListaDelete;
  listas: Listas;
  divAddMetaLista = false;
  listaCombos: any[];
  msjAddMetaLista = '';
  msj = '';
  msjModal = '';
  closeResult: string;
  selected = [];
  divEnabled = true;
  metaLista: any[];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any[] = [];
  temp = [];
  divList = false;

  constructor(
    private metaListasService: MetaListasService,
    private listasService: ListasService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.metaListaSelect = new MetaListaSelect('', '');
    this.metaListaInsert = new MetaListaInsert('', '', '', '', '', '');
    this.metaListaDelete = new MetaListaDelete('', '', '');
    this.listas = new Listas('', '', '');
  }

  ngOnInit() {
    this.buscar();
    $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
  }

  buscar() {
    $('#loading').css('display', 'block');
    this.metaListasService.getMetaListas(this.metaListaSelect).subscribe(
      (response: any) => {
        if (response.rowCount > 0) {
          this.divList = true;
          this.rows = response.rows;
          this.temp = this.rows;
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

  listados() {
    this.listas.adm = '0';
    this.listasService.getListas(this.listas).subscribe(
      (response: any) => {
        this.listaCombos = response.listas;
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  nuevaMetaLista() {
    this.divAddMetaLista = true;
    this.listados();
  }

  addMetaLista() {

    if (this.validar()) {
      this.metaListaInsert.metaLista = (this.metaListaInsert.metaLista.toUpperCase()).trim();
      this.metaListaInsert.titulo = this.metaListaInsert.titulo.trim();
      this.metaListasService.insertMetaLista(this.metaListaInsert).subscribe(
        (response: any) => {
          if (response.code === '0') {
            swal('Meta Listas', 'Registro guardado con éxito', 'success');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/esr/configuracion/meta-listas']));
          } else {
            swal('Meta Listas', response.description, 'error');
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }

  validar() {
    this.msjAddMetaLista = '';
    const pattLetras = /^[a-zA-Z]*$/;
    const pattLetrasNumerosEspacios = /^[a-zA-ZñÑ0-9-:()áéíóúÁÉÍÓÚ\s]*$/;
    if (this.metaListaInsert.metaLista === '') {
      this.msjAddMetaLista = 'Debe indicar la meta lista.';
      return false;
    }
    if (!this.metaListaInsert.metaLista.match(pattLetras)) {
      this.msjAddMetaLista = 'La meta lista solo puede contener letras.';
      return false;
    }
    if (this.metaListaInsert.titulo === '') {
      this.msjAddMetaLista = 'Debe indicar el título.';
      return false;
    }
    if (!this.metaListaInsert.titulo.match(pattLetrasNumerosEspacios)) {
      this.msjAddMetaLista = 'El título solo puede ser alfanumerico.';
      return false;
    }
    if (this.metaListaInsert.listaDatos === '') {
      this.msjAddMetaLista = 'Debe indicar la lista de datos.';
      return false;
    }
    if (this.metaListaInsert.listaAcceso === '') {
      this.msjAddMetaLista = 'Debe indicar la lista de acceso.';
      return false;
    }
    /* for(let i=0; i < this.rows.length; i++){
       if(this.rows[i].metaLista.toUpperCase() === this.metaListaInsert.metaLista.toUpperCase()){
         this.msjAddMetaLista = 'La meta lista ya existe.';
         return false;
       }
     }
     for(let i=0; i < this.rows.length; i++){
       if(this.rows[i].listaAcceso === this.metaListaInsert.listaAcceso && this.rows[i].listaDatos === this.metaListaInsert.listaDatos){
         this.msjAddMetaLista = 'La combinación de lista datos y lista acceso seleccionadas, ya existe.';
         return false;
       }
     } */
    return true;
  }

  cancelAddMetaLista() {
    this.divAddMetaLista = false;
    this.metaListaInsert.metaLista = '';
    this.metaListaInsert.titulo = '';
    this.metaListaInsert.listaDatos = '';
    this.metaListaInsert.listaAcceso = '';
  }

  open(content, rowIndex) {
    this.metaListaDelete.metaLista = this.rows[rowIndex].metaLista;
    this.msjModal = '¿Está seguro que quiere borrar la meta lista?';
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
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

  deleteMetalista() {
    this.metaListasService.deleteMetaLista(this.metaListaDelete).subscribe(
      (response: any) => {
        if (response.code === '0') {
          swal('Meta Listas', 'Registro borrado con éxito', 'success');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
            this.router.navigate(['/esr/configuracion/meta-listas']));
        } else {
          swal('Meta Listas', response.description, 'error');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(function (d) {
      return d.metaLista.toLowerCase().indexOf(val) !== -1 || d.titulo.toLowerCase().indexOf(val) !== -1;
    });
    this.table.offset = 0;
  }

  openItems(rowIndex) {
    this.divEnabled = false;
    this.metaLista = this.rows[rowIndex];
  }

  /* openItems(){
    this.divEnabled = false;
    this.metaLista = this.selected;
  } */
}
