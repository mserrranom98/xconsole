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

  estadoCuenta = '';
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
  ) { }

  ngOnInit() {
    this.getCuentas('S');
  }

  getCuentas(activo) {
    let ccActivo = '';
    if (activo.target) {
      ccActivo = activo.target.value;
    } else {
      ccActivo = activo;
    }
    this.cuentasContablesServices.getCuentas(ccActivo).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Cuentas', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
      } else {
        this.cuentas = response.cuentascontables;
      }
    });
  }

  editarCuenta(event) {
    this.cuentasContablesServices.getEditarCuenta(event.data).subscribe((response: any) => {
      console.log(event);
      if (response.code === '0') {
        swal('Cuenta Contable', 'Registro Editado con Exito', 'success');
        this.getCuentas(event.data.activo);
      } else {
        swal('Cuenta Contable', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  addCuenta(event) {
    this.cuentasContablesServices.getCrearCuenta(event.data).subscribe((response: any) => {
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

  validarCuenta(e) {
    if (e.isValid && this.cuentas.filter((item) => item.cuenta === e.newData.cuenta).length > 0) {
      e.isValid = false;
      e.errorText = 'El numero de cueta que ingreso, ya existe';
    }
  }

  onEditorPreparing(e) {
    if (!e.row.inserted && e.dataField === 'cuenta') {
      e.editorOptions.disabled = true;
    }
    if (e.row.inserted && e.dataField === 'activo') {
      e.editorOptions.value = 'S';
      e.editorOptions.disabled = true;
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

  enviar() {
    this.dialogRef.close();
  }
}
