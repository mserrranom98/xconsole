import {Component, OnInit} from '@angular/core';
import {UsuarioSucursalService} from '../../../../shared/services/usuario-sucursal/usuario-sucursal.service';
import swal from 'sweetalert2';
import {EmpresasService} from '../../../../shared/services/empresas/empresas.service';
import {SucursalesService} from '../../../pages-services/serv-emp-rec/sucursales.service';

@Component({
  selector: 'app-usuario-sucursal',
  templateUrl: './usuario-sucursal.component.html'
})
export class UsuarioSucursalComponent implements OnInit {

  usuarios = [];
  empresas = [];
  sucursales = [];

  noDataText = 'No hay datos que mostrar';

  constructor(
    private usuariosService: UsuarioSucursalService,
    private empresasService: EmpresasService,
    private sucursalesService: SucursalesService
  ) {
    this.getEmpresas();
    this.getSucursales();
    this.getUsuarios();
  }

  ngOnInit() {
  }

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe((response: any) => {
      if (response.code === '0') {
        this.usuarios = response.usuarios;
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      } else {
        console.log(response);
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
        swal('Operaciones', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
      }
    }, error => {
      console.log(error);
    });
  }

  getEmpresas() {
    this.empresasService.getRex().subscribe((response: any) => {
        this.empresas = response.rexs;
    }, error => {
      console.log(error);
    })
  }

  getSucursales() {
    this.sucursalesService.getSuc('BCOCON').subscribe((response: any) => {
      this.sucursales = response.sucursales;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Asignar restricciones a un usuario
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method addUsuario Se comunica con los servios de RSUMB */
  addUsuario(row) {
    this.usuariosService.addUsuario(row.data).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Restricciones de usuario', 'Registro Creado con Exito', 'success');
        this.getUsuarios();
      } else {
        swal('Restricciones de usuario', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Elimina la asignacion segun la linea seleccionada
   * @param row Contiene los datos y funciones de la linea seccionada en dx-data-grid
   * @method deleteUsuario Se comunica con los servicios de RSUMB */
  removeUsuario(row) {
    this.usuariosService.deleteUsuario(row.data.id).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Restricciones de usuario', 'Registro Eliminado', 'success');
        this.getUsuarios();
      } else {
        swal('Restricciones de usuario', 'Registro No ha sido Eliminado', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

}
