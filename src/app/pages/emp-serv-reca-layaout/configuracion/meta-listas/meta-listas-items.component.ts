import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {DatosMetaLista, ListasItems, MetaListaItemSelect, MetaListaItemSet} from '../../../pages-models/model-emp-serv-rec';
import {MetaListasService} from '../../../pages-services/serv-emp-serv-rec/meta-listas.services';
import {ListasService} from '../../../pages-services/serv-emp-serv-rec/listas.services';

@Component({
  selector: 'app-meta-listas-items',
  templateUrl: './meta-listas-items.component.html',
  styleUrls: ['./meta-listas-items.component.scss']
})
export class MetaListasItemsComponent implements OnInit {
  metaListaItemSelect: MetaListaItemSelect;
  metaListaItemSet: MetaListaItemSet;
  listasItemsD: ListasItems;
  listasItemsA: ListasItems;
  listaDatos: any[];
  listaAcceso: any[];
  msj = '';
  closeResult: string;
  items: {
    'itemAcceso': string,
    'itemDato': string
  };
  editingAcceso = {};
  cancelAcceso = {};

  @Input() metaLista: DatosMetaLista;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any[] = [];
  divList = false;

  constructor(
    private metaListasService: MetaListasService,
    private listasService: ListasService,
    private router: Router
  ) {
    this.metaListaItemSelect = new MetaListaItemSelect('', '', '');
    this.metaListaItemSet = new MetaListaItemSet('', '', '', [{itemAcceso: '', itemDato: ''}]);
    this.listasItemsD = new ListasItems('', '', '');
    this.listasItemsA = new ListasItems('', '', '');
    this.metaLista = new DatosMetaLista('', '', '', '', '', '', '', '');
  }

  ngOnInit() {
    this.listaDatos = [];
    this.metaListaItemSelect.metaLista = this.metaLista.metaLista;
    $('#loading').css('display', 'block');
    this.metaListasService.getMetaListaItem(this.metaListaItemSelect).subscribe(
      (response: any) => {
        if (response.rowCount > 0) {
          this.divList = true;
          // this.rows = response.rows;
          for (let i = 0; i < response.rows.length; i++) {
            this.rows[i] = {
              glosaD: response.rows[i].itemDatoTitulo,
              itemD: response.rows[i].itemDato,
              glosaA: response.rows[i].itemAccesoTitulo,
              itemA: response.rows[i].itemAcceso
            };
          }
          this.listadoAcceso();
          $('#loading').css('display', 'none');
        }
        if (response.rowCount === 0 && response.code === '0') {
          $('#loading').css('display', 'none');
          this.asociarMetaListas();
        }
        if (response.code !== '0') {
          swal('Meta Items', response.description, 'error');
          $('#loading').css('display', 'none');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  onVolver() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate(['/esr/configuracion/meta-listas']));
  }

  asociarMetaListas() {
    this.listados();
  }

  listados() {
    this.listasService.getListasDet(this.metaLista.listaDatos).subscribe(
      (response: any) => {
        this.listaDatos = response.items;
        if (this.listaDatos.length > 0) {
          for (let i = 0; i < this.listaDatos.length; i++) {
            this.rows[i] = {
              glosaD: this.listaDatos[i].glosa,
              itemD: this.listaDatos[i].item,
              glosaA: '',
              itemA: ''
            };
          }
          this.listadoAcceso();
          this.divList = true;
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  listadoAcceso() {
    this.listasService.getListasDet(this.metaLista.listaAcceso).subscribe(
      (response: any) => {
        this.listaAcceso = response.items;
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  updateAccesoValue(event, cell, rowIndex) {
    this.editingAcceso[rowIndex + '-' + cell] = false;
    this.cancelAcceso[rowIndex + '-' + cell] = false;
    this.rows[rowIndex]['glosaA'] = event.target.options[event.target.selectedIndex].text;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  validarMetaItems() {
    this.msj = '';
    let cont = 0;
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].itemA === '') {
        cont++;
      }
    }
    if (cont === 0) {
      this.guardarMetaItems();
    } else {
      this.msj = 'Debe indicar todos los accesos.';
    }
  }

  guardarMetaItems() {
    for (let i = 0; i < this.rows.length; i++) {
      this.items = {
        itemAcceso: this.rows[i].itemA,
        itemDato: this.rows[i].itemD
      };
      this.metaListaItemSet.rows[i] = this.items;
    }
    // this.metaListaItemSet.metaLista = this.metaLista[0].metaLista;
    this.metaListaItemSet.metaLista = this.metaLista.metaLista;
    this.metaListasService.setMetaListaItem(this.metaListaItemSet).subscribe(
      (response: any) => {
        if (response.code === '0') {
          swal('Meta Items', 'Registros guardados con éxito', 'success');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
            this.router.navigate(['/esr/configuracion/meta-listas']));
        } else {
          swal('Meta Items', response.description, 'error');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }
}
