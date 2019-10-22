import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import {IntegrantesService} from '../../../shared/services/integrantes/integrantes.service';

@Component({
  selector: 'app-integrantes',
  templateUrl: './integrantes.component.html'
})
export class IntegrantesComponent implements OnInit {

  integrantes = [];

  estados = [
    {
      id: 'S',
      estado: 'Activo (S)'
    },
    {
      id: 'N',
      estado: 'Inactivo (N)'
    },
  ];
  noDataText = 'No hay datos que mostrar';

  constructor(
    private integrantesService: IntegrantesService
  ) { }

  ngOnInit() {
    this.getIntegrantes('S');
  }

  /** (MS) - Recupera los integrantes segun el estado
   * @param activo Contiene el estado por el cual se realizara la busqueda
   * @method getIntegrantes Se conecta con el Servicio RSUMB */
  getIntegrantes(activo) {
     this.integrantesService.getIntegrantes(activo).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Cuentas', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
        $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
      } else {
        console.log(response);
        this.integrantes = response.grupoMailIntegrantes;
        $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
      $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
    });
  }

  /** (MS) - Modificar cuentas contables
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method getEditarCuenta Se comunica con los servios de RSUMB */
  editarIntegrante(row) {
    this.integrantesService.updateIntegrante(row.data).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Cuenta Contable', 'Registro Editado con Exito', 'success');
        this.getIntegrantes(row.data.estado);
      } else {
        swal('Cuenta Contable', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Agregar una cuenta contable nueva
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method getCrearCuenta Se comunica con los servios de RSUMB */
  addIntegrante(row) {
    this.integrantesService.addIntegrante(row.data).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Cuenta Contable', 'Registro Creado con Exito', 'success');
        this.getIntegrantes('S');
      } else {
        swal('Cuenta Contable', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Crear validacion para comprobar si ya existe la cuenta contable en la variable cuentas al agregar una
   * nueva cuenta contable en dx-data-grid
   * @param e Contiene las funciones de validacion en dx-data-grid */
  validarIntegrante(e) {
    if (e.isValid && this.integrantes.filter((item) => item.correoIntg === e.newData.correoIntg).length > 0) {
      e.isValid = false;
      e.errorText = 'El numero de cueta que ingreso, ya existe';
    }
  }

  /** (MS) - Modifica los campos al ejecutar las funciones de agregar y editar en dx-data-grid
   * @param e Contiene las funciones de campos en dx-data-grid */
  onEditorPreparing(e) {
    if (e.row.inserted && e.dataField === 'estado') {
      e.editorOptions.value = 'S';
      e.editorOptions.disabled = true;
    }
  }

}
