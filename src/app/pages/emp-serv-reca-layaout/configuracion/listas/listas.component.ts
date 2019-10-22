import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import swal from 'sweetalert2';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LDelete, ListaIU, Listas, ListasItems} from '../../../pages-models/model-emp-serv-rec';
import {ListasService} from '../../../pages-services/serv-emp-serv-rec/listas.services';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html'
})

export class ListasComponent implements OnInit {
  @ViewChild(DatatableComponent) tblList: DatatableComponent;
  @ViewChild('panel', {read: ElementRef}) public panel: ElementRef;
  @ViewChild('f') f: NgForm;
  @Output() datos = new EventEmitter();
  @Input() tipo: string;
  tipoB = '';
  adm: Listas;
  listaIU: ListaIU;
  lDelete: LDelete;
  listasItems: ListasItems;
  list = [];
  opc = {};
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

  constructor(
    private listasService: ListasService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.data = [];
    this.adm = new Listas('', '', '');
    this.listaIU = new ListaIU('', '', '', '', '');
    this.lDelete = new LDelete('', '', '');
    this.listasItems = new ListasItems('', '', '');
  }

  ngOnInit() {
    this.opc = {};
    this.list = [];
    this.listasService.getListasDet('TIPOLI').subscribe((response: any) => {
        this.list = response.items;
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      });

    this.buscar();
    $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
  }

  buscar() {
    // Consultar Lista
    let list = '';
    if (this.tipo === '') {
      list = this.listaIU.tipo;
    } else if (this.tipoB !== '') {
      list = this.tipoB;
    } else {
      list = this.tipo;
    }

    if (list === 'SYSTEM' || this.tipoB === 'SYSTEM') {
      this.adm.adm = '1';
    } else {
      this.adm.adm = '0';
    }
    this.opc = {};
    this.data = [];
    this.listasService.getListas(this.adm).subscribe((response: any) => {
        /* console.log(JSON.stringify(response));*/
        if (response.code === '6996') {
          swal('Listas', response.description + '. Verifique Servidor Netswitch', 'error');
        } else {
          const dir = response.listas.length;
          for (let i = 0; i < dir; i++) {
            this.opc = {
              lista: response.listas[i].lista,
              titulo: response.listas[i].titulo,
              tipo: response.listas[i].tipo
            };
            this.data[i] = this.opc;
          }
          this.rows = this.data;
          this.temp = this.data;
        }
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
  }

  nuevo() {
    this.listaIU.lista = '';
    this.listaIU.titulo = '';
    this.disabled = false;
    this.divIU = true;
    this.gestion = 'nuevo';
  }

  onNuevo() {
    this.listasService.insertListas(this.listaIU).subscribe((response: any) => {
        if (response.code === '0') {
          swal('Listas', 'Registro Creado con Exito', 'success');
          this.buscar();
        } else {
          swal('Listas', response.description + '. Verifique Información', 'error');
        }
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
  }

  onCancel() {
    this.limpiar();
  }

  editar(rowIndex) {
    this.divIU = true;
    this.disabled = true;
    const obj = this.rows[rowIndex];
    this.listaIU.lista = obj['lista'];
    this.listaIU.titulo = obj['titulo'];
    this.listaIU.tipo = obj['tipo'];
    this.gestion = 'actualizar';
    this.panel.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'start'});
  }

  onEditar() {
    this.listasService.updateListas(this.listaIU).subscribe((response: any) => {
        if (response.code === '0') {
          swal('Listas', 'Registro Actualizado con Exito', 'success');
          this.buscar();
        } else {
          swal('Listas', 'Verifique Información', 'error');
        }
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
  }

  guardar() {
    this.divIU = false;
    this.disabled = false;
    if (this.gestion === 'nuevo') {
      this.onNuevo();
    } else {
      this.onEditar();
    }
    this.limpiar();
  }

  eliminar(rowIndex) {
    const obj = this.rows[rowIndex];
    this.lDelete.lista = obj['lista'];
    swal({
      title: 'Advertencia!',
      type: 'warning',
      text: 'Eliminar: ' + obj['titulo'],
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.listasService.deleteListas(this.lDelete).subscribe(
          (response: any) => {
            if (response.code === '0') {
              swal('Listas', 'Registro Eliminado', 'success');
              this.buscar();
            } else {
              swal('Listas', 'Registro No ha sido Eliminado', 'error');
            }
          },
          error => {
            console.log(<any>error);
          });
      } else {
        swal('Listas', 'Registro No ha sido Eliminado', 'warning');
      }
    });

  }

  onSelect(rowIndex) {
    this.datos.emit(JSON.stringify(this.rows[rowIndex]));
    console.log(JSON.stringify(this.rows[rowIndex]));
    this.router.navigate(['/esr/configuracion/listas'], {relativeTo: this.route.parent});
  }

  limpiar() {
    this.divIU = false;
    this.divTipo = true;
    this.adm = new Listas('', '', '');
    this.listaIU = new ListaIU('', '', '', '', '');
    this.lDelete = new LDelete('', '', '');
    this.buscar();
  }

  tipoFilter(val) {
    this.rows = this.temp.filter(function (d) {
      return d.tipo.toLowerCase().indexOf(val) !== -1;
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    this.rows = this.temp.filter(function (d) {
      return d.titulo.toLowerCase().indexOf(val) !== -1;
    });
    this.tblList.offset = 0;
  }

}
