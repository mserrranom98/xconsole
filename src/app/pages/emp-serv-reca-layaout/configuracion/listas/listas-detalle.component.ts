import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {DatatableComponent} from '@swimlane/ngx-datatable';
import swal from 'sweetalert2';
import {ListaIU, ListasItems, LItemDelete, LItemIU} from '../../../pages-models/model-emp-serv-rec';
import {ListasService} from '../../../pages-services/serv-emp-serv-rec/listas.services';


@Component({
  selector: 'app-listas-detalle',
  templateUrl: './listas-detalle.component.html',
  styles: []
})
export class ListasDetalleComponent implements OnInit {
  @ViewChild(DatatableComponent) tblDet: DatatableComponent;
  @ViewChild('panel', {read: ElementRef}) public panel: ElementRef;
  listaIU: ListaIU;             // Lista
  listasItems: ListasItems;     // Lista Detalle
  litemIU: LItemIU;             // Lista Detalle Insert Update
  lItemDelete: LItemDelete;     // Lista Detalle Delete
  divEnabled = false;
  data = [];
  rows = [];
  temp = [];
  columns = [];
  divIU = false;
  disabled = false;
  gestion = '';
  opc = {};
  tipo = '';
  index = '';

  constructor(private listasService: ListasService) {
    this.listaIU = new ListaIU('', '', '', '', '');
    this.listasItems = new ListasItems('', '', '');
    this.litemIU = new LItemIU('', '', '', '', '');
    this.lItemDelete = new LItemDelete('', '', '', '');
    this.data = [];
  }

  ngOnInit() {
  }

  recibirDatos(event) {
    if (event !== null) {
      this.divEnabled = true;
      // tslint:disable-next-line:prefer-const
      let obj = JSON.parse(event);
      this.listaIU.lista = obj['lista'];
      this.listaIU.tipo = obj['tipo'];
      this.tipo = obj['tipo'];
      this.listaIU.titulo = obj['titulo'];
      this.listasItems.lista = obj['lista'];
      this.buscar();
    } else {
      this.divEnabled = false;
    }
  }

  buscar() {
    this.opc = {};
    this.data = [];
    this.listasService.getListasDet('').subscribe((response: any) => {
      const dir = response.items.length;
      for (let i = 0; i < dir; i++) {
        this.opc = {
          lista: response.items[i].lista,
          glosa: response.items[i].glosa,
          item: response.items[i].item
        };
        this.data[i] = this.opc;
      }
      this.rows = this.data;
      this.temp = this.data;
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
  }

  nuevo() {
    this.divIU = true;
    this.gestion = 'nuevo';
    this.litemIU.glosa = '';
    this.litemIU.item = '';
  }

  onNuevo() {
    this.litemIU.lista = this.listasItems.lista;
    this.listasService.insertLDet(this.litemIU).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Lista Detalle', 'Registro Creado con Exito', 'success');
        this.buscar();
      } else {
        swal('Lista Detalle', response.description + '. Verifique Información', 'error');
        this.divIU = true;
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  editar(rowIndex) {
    this.index = rowIndex;
    this.divIU = true;
    this.disabled = true;
    this.gestion = 'actualizar';
    const obj = this.rows[rowIndex];
    this.litemIU.item = obj['item'];
    this.litemIU.glosa = obj['glosa'];
    this.litemIU.lista = obj['lista'];
    this.panel.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'start'});
  }

  onEditar() {
    this.litemIU.lista = this.listasItems.lista;
    this.listasService.updateLDet(this.litemIU).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Lista Detalle', 'Registro Actualizado con Exito', 'success');
        this.buscar();
      } else {
        swal('Lista Detalle', 'Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  eliminar(rowIndex) {
    const obj = this.rows[rowIndex];
    this.lItemDelete.lista = obj['lista'];
    this.lItemDelete.item = obj['item'];
    swal({
      title: 'Advertencia!',
      type: 'warning',
      text: 'Eliminar: ' + obj['glosa'],
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.listasService.deleteLDet(this.lItemDelete).subscribe((response: any) => {
          if (response.code === '0') {
            swal('Lista Detalle', 'Registro Eliminado', 'success');
            this.buscar();
          } else {
            swal('Lista Detalle', 'Registro No ha sido Eliminado', 'error');
          }
        }, error => {
          console.log(<any>error);
        });
      } else {
        swal('Lista Detalle', 'Registro No ha sido Eliminado', 'warning');
      }
    });

  }

  onCancel() {
    this.divIU = false;
    this.gestion = 'nuevo';
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(function (d) {
      return d.titulo.toLowerCase().indexOf(val) !== -1;
    });
    this.tblDet.offset = 0;
  }

  onVolver() {
    this.limpiar();
    this.divEnabled = false;
    this.divIU = false;
    this.disabled = false;
  }

  limpiar() {
    this.listaIU = new ListaIU('', '', '', '', '');
    this.listasItems = new ListasItems('', '', '');
    this.litemIU = new LItemIU('', '', '', '', '');
    this.lItemDelete = new LItemDelete('', '', '', '');
    this.data = [];
  }
}
