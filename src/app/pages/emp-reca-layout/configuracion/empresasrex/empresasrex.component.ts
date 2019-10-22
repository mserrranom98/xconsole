import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import swal from 'sweetalert2';
import {NgForm} from '@angular/forms';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {RexDelete, RexIU, RexSelect} from '../../../pages-models/model-emp-rec';
import {EmpRexsService} from '../../../pages-services/serv-emp-rec/emp-rexs.service';

@Component({
  selector: 'app-empresasrex',
  templateUrl: './empresasrex.component.html'

})
export class EmpresasrexComponent implements OnInit {
  @ViewChild('f') f: NgForm;
  @ViewChild(DatatableComponent) tblList: DatatableComponent;
  @ViewChild('panelE', {read: ElementRef}) public panelE: ElementRef;
  opc = {};
  data = [];
  rows = [];
  temp = [];
  columns = [];
  rexIU: RexIU;
  rexDelete: RexDelete;
  rexSelect: RexSelect;
  divIU = false;
  gestion = '';
  disabled = false;
  divList = false;
  msj = '';
  disabledAcc = true;

  constructor(private empRexsService: EmpRexsService) {
    this.rexIU = new RexIU('', '', '', '');
    this.rexDelete = new RexDelete('', '', '');
    this.rexSelect = new RexSelect('', '');
  }

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    // Consultar Empresas REXS
    this.data = [];
    this.msj = '';
    this.empRexsService.getRex().subscribe(
      (response: any) => {
        const dir = response.rexs.length;
        if (dir > 0) {
          this.divList = true;
          for (let i = 0; i < dir; i++) {
            this.opc = {
              rex: response.rexs[i].rex,
              descripcion: response.rexs[i].descripcion
            };
            this.data[i] = this.opc;
          }
          this.rows = this.data;
          this.temp = this.data;
          $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
        } else {
          this.msj = 'No hay resultados.';
          $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
        $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
      }
    )
  }

  nuevo() {
    this.gestion = 'nuevo';
    this.rexIU = new RexIU('', '', '', '');
    this.disabled = false;
    this.divIU = true;
    this.disabledAcc = false;
  }

  onNuevo() {
    this.empRexsService.insertRex(this.rexIU).subscribe(
      (response: any) => {
        if (response.code === '0') {
          swal('Empresas(REX)', 'Registro guardado con Exito', 'success');
          this.buscar();
          this.disabledAcc = true;
        } else {
          swal('Empresas(REX)', response.description + '. Verifique Información', 'error');
          this.disabledAcc = true;
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )

  }

  editar(rowIndex) {
    this.divIU = true;
    this.disabled = true;
    const obj = this.rows[rowIndex];
    this.rexIU.rex = obj['rex'];
    this.rexIU.descripcion = obj['descripcion'];
    this.gestion = 'actualizar';
    this.panelE.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'start'});
  }

  onEditar() {
    this.empRexsService.updateRex(this.rexIU).subscribe(
      (response: any) => {
        if (response.code === '0') {
          swal('Empresas(REX)', 'Registro Actualizado con Exito', 'success');
          this.buscar();
        } else {
          swal('Empresas(REX)', response.description + '. Verifique Información', 'error');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
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

  onEliminar(rowIndex) {
    const obj = this.rows[rowIndex];
    this.rexDelete.rex = obj['rex'];
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
        this.empRexsService.deleteRex(this.rexDelete).subscribe(
          (response: any) => {
            if (response.code === '0') {
              swal('Empresas(REX)', 'Registro Eliminado', 'success');
              this.buscar();
            } else {
              swal('Empresas(REX)', 'Registro No ha sido Eliminado', 'error');
            }
          },
          error => {
            console.log(<any>error);
          });
      } else {
        swal('Empresas(REX)', 'Registro No ha sido Eliminado', 'warning');
      }
    });
  }

  limpiar() {
    this.rexIU = new RexIU('', '', '', '');
    this.rexDelete = new RexDelete('', '', '');
    this.gestion = '';
    this.divIU = false;
  }

  onCancel() {
    this.limpiar();
    this.disabledAcc = true;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    this.rows = this.temp.filter(function (d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1;
    });
    this.tblList.offset = 0;
  }

}
