import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {CuentaContableService} from '../cuentas-contables.service';
import swal from 'sweetalert2';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminCuentasContablesComponent} from '../admin-cuentas-contables/admin-cuentas-contables.component';

@Component({
  selector: 'app-asignacion-cuentas-contables',
  templateUrl: './asignacion-cuentas-contables.component.html'
})
export class AsignacionCuentasContablesComponent implements OnInit {

  dataSelectIns = [];
  dataSelectMed = [];
  dataSelectTip = [];
  dataCCIS = [];
  rowsCCI = [];
  dataSelectCueA = [];

  public formAsignacion: FormGroup;

  instrumento = false;
  medioPago = false;
  dspsdebuscar = false;

  constructor(
    public dialogRef: MatDialogRef<AsignacionCuentasContablesComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private cuentasContablesServices: CuentaContableService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getCuentasActivas();
    this.buscarCCI();
    this.cuentasContablesServices.getInstrumentoNoPago().subscribe((response: any) => {
      this.dataSelectIns = response.instrumentonopago;
      // console.log(this.dataSelectIns);
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
    this.cuentasContablesServices.getMediosPago().subscribe((response: any) => {
      this.dataSelectMed = response.mediospago;
      //  console.log(this.dataSelectMed);
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });

    this.formAsignacion = this.fb.group({
      cuenta: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      tipoCuenta: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      instrumento: new FormControl('', Validators.required),
    })
  }

  buscarCCI() {
    this.cuentasContablesServices.getCCISelect().subscribe((response: any) => {
      if (response.code !== '0') {
        swal('CCI', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
      } else {

        this.dataCCIS = response.cci;

        this.rowsCCI = this.dataCCIS;
      }

      this.rowsCCI = this.dataCCIS;
    });
  }

  eliminarCCI(event) {
    swal(
      {
        title: 'Advertencia, se eliminará la asignación cuenta con instrumento!',
        type: 'warning',
        text: '',
        confirmButtonColor: '#0CC27E',
        cancelButtonColor: '#FF586B',
        confirmButtonText: 'OK',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }
    ).then((result) => {
      if (result.value) {
        this.cuentasContablesServices.getCCIDelete(event.data).subscribe(
          (response: any) => {
            if (response.code === '0') {
              swal('Cuentas', 'Registro Eliminado', 'success');
              this.buscarCCI();
            } else {
              swal('Cuentas', 'Registro No ha sido Eliminado', 'error');
            }
          },
          error => {
            console.log(<any>error);
          });
      } else {
        swal('Cuentas', 'Registro No ha sido Eliminado', 'warning');
      }
    });
  }

  guardarCCI() {
    if (this.formAsignacion.valid) {
      // console.log(this.formAsignacion.getRawValue());
      this.cuentasContablesServices.getCCIInsert(this.formAsignacion.getRawValue()).subscribe((response: any) => {
        if (response.code === '0') {
          swal('Cuenta Contable', 'Asignación creada con Exito', 'success');
          this.buscarCCI();
        } else {
          swal('Cuenta Contable, Instrumento', response.description + '. Verifique Información', 'error');
        }
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
    } else {
      swal('Cuenta Contable', 'Por favor, verificar que los campos esten correctos', 'error');
    }
  }

  getCuentasActivas() {
    this.cuentasContablesServices.getCuentaActiva().subscribe((response: any) => {
      this.dataSelectCueA = response.cuentacontableactiva;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  tipoMedioPago(event) {
    if (event.target.value === 'ins') {
      this.instrumento = true;
      this.medioPago = false;
    } else if (event.target.value === 'mpago') {
        this.medioPago = true;
        this.instrumento = false;
    }
  }

  openAdmin() {
    this.dialog.open(AdminCuentasContablesComponent, {width: '1000px', height: '750px'}).afterClosed().subscribe(result => {
      this.getCuentasActivas();
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
