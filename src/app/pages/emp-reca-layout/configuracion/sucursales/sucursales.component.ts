import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { SucSelect, SucDelete, RexSelect } from '../../../pages-models/model-emp-rec';
import { SucursalesService } from '../../../pages-services/serv-emp-rec/sucursales.service';
import { EmpRexsService } from '../../../pages-services/serv-emp-rec/emp-rexs.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html'
})
export class SucursalesComponent implements OnInit {
  @ViewChild('f') f: NgForm;
  @ViewChild(DatatableComponent) tblList: DatatableComponent;
  @Output() datos = new EventEmitter();
  // @Input() prueba: string;
  opc = new Object();
  data = [];
  rows = [];
  detalle = [];
  temp = [];
  columns = [];
  sucSelect: SucSelect;
  sucDelete: SucDelete;
  rexSelect: RexSelect;
  listEmpRex: any[];
  divList = false;
  msj = '';
  disNuevo = true;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sucursalesService: SucursalesService,
    private empRexsService: EmpRexsService) {
    this.sucDelete = new SucDelete('', '', '', '');
    this.sucSelect = new SucSelect('', '', '');
    this.rexSelect = new RexSelect('', '');
  }

  ngOnInit() {
    this.empRexsService.getRex().subscribe(
      (response: any) => {
        this.listEmpRex = response.rexs;
      }
    );
    this.sucSelect.rex = VAR_SUC.rex;
    this.buscar();
    $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
  }

  buscar() {
    // Consultar Empresas REXS
    this.data = [];
    this.msj = '';
    if (this.sucSelect.rex === '') {
      this.disNuevo = true;
    } else {
      this.disNuevo = false;
    }
    this.sucursalesService.getSuc(this.sucSelect.rex).subscribe(
      (response: any) => {
        if (response.code === '0') {
          const dir = response.sucursales.length;
          if (dir > 0) {
            this.divList = true;
            for (let i = 0; i < dir; i++) {
              this.opc = {
                sucursal: response.sucursales[i].sucursal,
                descripcion: response.sucursales[i].descripcion,
                rex: response.sucursales[i].rex,
                properties: response.sucursales[i].properties
              },
                this.data[i] = this.opc;
            }
          } else {
            this.data = [];
            this.msj = 'No hay resultados.';
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

  toggleExpandRow(row) {
    this.tblList.rowDetail.collapseAllRows();
    this.detalle = [];
    this.opc = {};
    for (let i = 0; i < this.rows.length; i++) {
      if (row.sucursal === this.rows[i].sucursal) {
        this.opc = {
          sucursal: this.rows[i].sucursal,
          descripcion: this.rows[i].descripcion,
          rex: this.rows[i].rex,
          properties: this.rows[i].properties
        }
        this.detalle[i] = this.opc;
      }
    }

    this.detalle = this.detalle.filter((i) => i !== null);
    this.tblList.rowDetail.toggleExpandRow(row);
  }

  editar(rowIndex) {
    this.datos.emit(JSON.stringify(this.rows[rowIndex]));
    this.router.navigate(['/er/configuracion/sucursal'], { relativeTo: this.route.parent });
  }

  onEliminar(rowIndex) {
    const obj = this.rows[rowIndex];
    this.sucDelete.sucursal = obj['sucursal'];
    this.sucDelete.rex = obj['rex'];
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
        this.sucursalesService.deleteSuc(this.sucDelete).subscribe(
          (response: any) => {
            if (response.code === '0') {
              swal('Sucursales', 'Registro Eliminado', 'success');
              this.buscar();
            } else {
              swal('Sucursales', 'Registro No ha sido Eliminado', 'error');
            }
          },
          error => {
            console.log(<any>error);
          });
      } else {
        swal('Sucursales', 'Registro No ha sido Eliminado', 'warning');
      }
    });
  }

  limpiar() {
    this.sucDelete = new SucDelete('', '', '', '');
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

  nuevo() {
    VAR_SUC.rex = this.sucSelect.rex;
    if (VAR_SUC.rex !== '') {
      this.router.navigate(['/er/configuracion/sucursal/new'], { relativeTo: this.route.parent });
    }
  }

}

export let VAR_SUC = {
  rex: ''
}
