import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { TerSelect, RexSelect, SucSelect, TerDelete } from '../../../pages-models/model-emp-rec';
import { TerminalesService } from '../../../pages-services/serv-emp-rec/terminales.service';
import { SucursalesService } from '../../../pages-services/serv-emp-rec/sucursales.service';
import { EmpRexsService } from '../../../pages-services/serv-emp-rec/emp-rexs.service';

@Component({
  selector: 'app-terminales',
  templateUrl: './terminales.component.html'
})
export class TerminalesComponent implements OnInit {
  @ViewChild(DatatableComponent) tblList: DatatableComponent;
  @ViewChild(DatatableComponent) tblDet: DatatableComponent;
  @Output() datos = new EventEmitter();

  opc = new Object();
  data = [];
  rows = [];
  detalle = [];
  temp = [];
  columns = [];
  terSelect: TerSelect;
  rexSelect: RexSelect;
  sucSelect: SucSelect;
  terDelete: TerDelete;

  listEmpRex: any[];
  listSuc: any[];
  divList = false;
  msj = '';
  disabled = true;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private terminalesService: TerminalesService,
    private sucursalesService: SucursalesService,
    private empRexsService: EmpRexsService) {
    this.terSelect = new TerSelect('', '', '', '');
    this.sucSelect = new SucSelect('', '', '');
    this.rexSelect = new RexSelect('', '');
    this.terDelete = new TerDelete('', '', '', '', '');
  }

  ngOnInit() {
    this.empRexsService.getRex().subscribe(
      (response: any) => {
        this.listEmpRex = response.rexs;
      }
    );

    this.terSelect.rex = VAR_TER.rex;
    this.sucSelect.rex = VAR_TER.rex;
    this.terSelect.sucursal = VAR_TER.suc;

    if (this.terSelect.rex !== '' && this.terSelect.sucursal !== '') {
      this.buscar();
      this.sucursal();
    }
    $('.page-loading').css({'z-index': '-1', 'opacity': '0'});

  }

  sucursal() {
    if (this.sucSelect.rex !== '' && this.terSelect.sucursal !== '') {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
    this.listSuc = [];
    this.rows = [];
    this.divList = false;
    this.sucursalesService.getSuc(this.sucSelect.rex).subscribe(
      (response: any) => {
        this.listSuc = response.sucursales;
      }
    )
  }

  buscar() {
    // Consultar Terminales
    if (this.terSelect.sucursal !== '') {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
    this.data = [];
    this.msj = '';
    this.terminalesService.getTer(this.terSelect.sucursal).subscribe(
      (response:any) => {
        if (response.code === '0') {
          const dir = response.terminales.length;
          if (dir > 0) {
            this.divList = true;
            for (let i = 0; i < dir; i++) {
              this.opc = {
                bloqueado: response.terminales[i].bloqueado,
                descripcion: response.terminales[i].descripcion,
                numeroCaja: response.terminales[i].numeroCaja,
                properties: response.terminales[i].properties,
                rex: response.terminales[i].rex,
                saf: response.terminales[i].saf,
                sucursal: response.terminales[i].sucursal,
                terminal: response.terminales[i].terminal,
                ubicacion: response.terminales[i].ubicacion
              },
                this.data[i] = this.opc;
            }
          } else {
            this.data = [];
            this.msj = 'No hay resultados.'
          }
          this.rows = this.data;
          this.temp = this.data;
        } else {
          this.msj = 'No hay resultados.'
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  toggleExpandRow(row) {
    this.tblList.rowDetail.collapseAllRows();
    this.detalle = [];
    this.opc = {};
    for (let i = 0; i < this.rows.length; i++) {
      if (row.descripcion === this.rows[i].descripcion) {
        this.opc = {
          bloqueado: this.rows[i].bloqueado,
          descripcion: this.rows[i].descripcion,
          numeroCaja: this.rows[i].numeroCaja,
          properties: this.rows[i].properties,
          rex: this.rows[i].rex,
          saf: this.rows[i].saf,
          sucursal: this.rows[i].sucursal,
          terminal: this.rows[i].terminal,
          ubicacion: this.rows[i].ubicacion
        }
        this.detalle[i] = this.opc;
      }
    }

    this.detalle = this.detalle.filter((i) => i !== null);
    this.tblList.rowDetail.toggleExpandRow(row);
  }


  editar(rowIndex) {
    this.datos.emit(JSON.stringify(this.rows[rowIndex]));
    this.router.navigate(['/er/configuracion/terminal'], { relativeTo: this.route.parent });
  }

  onEliminar(rowIndex) {
    const obj = this.rows[rowIndex];
    this.terDelete.rex = obj['rex'];
    this.terDelete.sucursal = obj['sucursal'];
    this.terDelete.terminal = obj['terminal'];
    swal({
      title: 'Advertencia!',
      type: 'warning',
      text: 'Eliminar: ' + obj['descripcion'],
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.terminalesService.deleteTer(this.terDelete).subscribe(
          (response:any) => {
            if (response.code === '0') {
              swal('Terminales', 'Registro Eliminado', 'success');
              this.buscar();
            } else {
              swal('Terminales', response.description, 'error');
            }
          },
          error => {
            console.log(<any>error);
          });
      } else {
        swal('Terminales', 'Registro No ha sido Eliminado', 'warning');
      }
    });
  }

  nuevo() {
    VAR_TER.rex = this.terSelect.rex;
    VAR_TER.suc = this.terSelect.sucursal;
    this.router.navigate(['/er/configuracion/terminal/new'], { relativeTo: this.route.parent });
  }

  limpiar() {
    // this.terDelete = new TerDelete('', '', '');
  }

  onCancel() {
    this.limpiar();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1;
    });

    this.rows = temp;
    this.tblList.offset = 0;
  }

}

export let VAR_TER = {
  rex: '',
  suc: ''
}
