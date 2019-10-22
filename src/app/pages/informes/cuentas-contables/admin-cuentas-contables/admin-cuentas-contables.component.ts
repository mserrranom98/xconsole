import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CuentaContableService} from '../cuentas-contables.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-cuentas-contables',
  templateUrl: './admin-cuentas-contables.component.html'
})
export class AdminCuentasContablesComponent implements OnInit {

  cuentas = [];

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

  soloEditar = true;

  constructor(
    private cuentasContablesServices: CuentaContableService,
    public dialogRef: MatDialogRef<AdminCuentasContablesComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.getCuentas('S');
  }

  ngOnInit() {}

  /** (MS) - Recupera las cuentas contables segun el estado
   * @param activo Contiene el estado por el cual se realizara la busqueda
   * @method getCuentas Se conecta con el Servicio RSUMB */
  getCuentas(activo) {
    this.cuentasContablesServices.getCuentas(activo).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Cuentas', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
      } else {
        this.cuentas = response.cuentascontables;
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Modificar cuentas contables
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method getEditarCuenta Se comunica con los servios de RSUMB */
  editarCuenta(row) {
    this.cuentasContablesServices.getEditarCuenta(row.data).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Cuenta Contable', 'Registro Editado con Exito', 'success');
        this.getCuentas(row.data.activo);
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
  addCuenta(row) {
    this.cuentasContablesServices.getCrearCuenta(row.data).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Cuenta Contable', 'Registro Creado con Exito', 'success');
        this.getCuentas('S');
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
  validarCuenta(e) {
    if (e.isValid && this.cuentas.filter((item) => item.cuenta === e.newData.cuenta).length > 0) {
      e.isValid = false;
      e.errorText = 'El numero de cueta que ingreso, ya existe';
    }
  }

  /** (MS) - Modifica los campos al ejecutar las funciones de agregar y editar en dx-data-grid
   * @param e Contiene las funciones de campos en dx-data-grid */
  onEditorPreparing(e) {
    if (!e.row.inserted && e.dataField === 'cuenta') {
      e.editorOptions.disabled = true;
      console.log('101');
    }
    if (e.row.inserted && e.dataField === 'activo') {
      console.log('103');
      e.editorOptions.value = 'S';
      e.editorOptions.disabled = true;
    }
    if (e.parentType === 'dataRow' && (e.dataField === 'centroCosto' || e.dataField === 'producto')) {
      e.editorOptions.maxLength = 3;
    }
    if (e.parentType === 'dataRow' && e.dataField === 'cuenta') {
      e.editorOptions.inputAttr = { maxLength: 13 };
    }
  }

  /** (MS) - Cerrar el componente tipo dialogo */
  cerrar() {
    this.dialogRef.close();
  }
}
