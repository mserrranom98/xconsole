import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {CuentaContableService} from '../cuentas-contables.service';
import swal from 'sweetalert2';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminCuentasContablesComponent} from '../admin-cuentas-contables/admin-cuentas-contables.component';
import {InstrumentosService} from '../../../../shared/services/instrumentos/instrumentos.service';

@Component({
  selector: 'app-asignacion-cuentas-contables',
  templateUrl: './asignacion-cuentas-contables.component.html'
})
export class AsignacionCuentasContablesComponent implements OnInit {

  dataSelectIns = [];
  dataSelectMed = [];
  rowsCCI = [];
  dataSelectCueA = [];

  instrumentoList = [];

  public formAsignacion: FormGroup;

  instrumentoView = true;

  constructor(
    public dialogRef: MatDialogRef<AsignacionCuentasContablesComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private cuentasContablesServices: CuentaContableService,
    private intrumentosServices: InstrumentosService,
    public dialog: MatDialog,
  ) {
    /** (MS) - Traer las cuentas contables activas, instrumentos y sus respectivas asociaciones */
    this.getCuentasActivas();
    this.getInstrumentos();
    this.getCCI();
  }

  ngOnInit() {
    /** (MS) - Inicializa los campos necesarios para crear una nueva asignacion de cuentas contables e instrumentos */
    this.formAsignacion = this.fb.group({
      cuenta: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      tipoCuenta: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      instrumento: new FormControl('', Validators.required),
    });
  }

  /** (MS) - Traer todas las asignaciones de cuentas contables a instrumentos
   * @method getCCISelect Se comunica con los servicios de RSUMB */
  getCCI() {
    this.cuentasContablesServices.getCCISelect().subscribe((response: any) => {
      if (response.code !== '0') {
        swal('CCI', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
      } else {
        this.rowsCCI = response.cci;
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Elimina la asignacion segun la linea seleccionada
   * @param row Contiene los datos y funciones de la linea seccionada en dx-data-grid
   * @method getCCIDelete Se comunica con los servicios de RSUMB */
   eliminarCCI(row) {
    this.cuentasContablesServices.getCCIDelete(row.data).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Cuentas', 'Registro Eliminado', 'success');
        this.getCCI();
      } else {
        swal('Cuentas', 'Registro No ha sido Eliminado', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Agregar una asignacion segun los datos en la formulario formAsignacion
   * @method getCCIInsert Se comunica con los servios de RSUMB */
  addCCI() {
    if (this.formAsignacion.valid) {
      // console.log(this.formAsignacion.getRawValue());
      this.cuentasContablesServices.getCCIInsert(this.formAsignacion.getRawValue()).subscribe((response: any) => {
        if (response.code === '0') {
          swal('Cuenta Contable', 'Asignación creada con Exito', 'success');
          this.getCCI();
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

  /** (MS) - Recupera las cuentas contables activas
   * @method getCuentaActiva Se conecta con el Servicio RSUMB*/
  getCuentasActivas() {
    this.cuentasContablesServices.getCuentaActiva().subscribe((response: any) => {
      console.log(response);
      this.dataSelectCueA = response.cuentacontableactiva;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Recupera los intrumentos segun si es medio de pago o no
   * @method getInstrumentoNoPago Se conecta con el Servicio RSUMB
   * @method getMediosPago Se conecta con el Servicio RSUMB */
  getInstrumentos() {
    this.intrumentosServices.getInstrumentoNoPago().subscribe((response: any) => {
      this.dataSelectIns = response.instrumentonopago;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
    this.intrumentosServices.getMediosPago().subscribe((response: any) => {
      this.dataSelectMed = response.mediospago;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Muestra los instrumentos segun el tipo de pago seleccionado en el select
   * @param event Contiene los datos de la opcion seleccionada */
  tipoMedioPago(event) {
    this.instrumentoView = null;
    if (event.target.value === 'ins') {
      this.instrumentoList = this.dataSelectIns;
    } else if (event.target.value === 'mpago') {
      this.instrumentoList = this.dataSelectMed;
    }
  }

  /** (MS) - Genera el componente tipo dialogo AdminCuentasContables y refresca las cuentas contables activas al cerrarlo */
  openAdmin() {
    this.dialog.open(AdminCuentasContablesComponent, {width: '1000px', height: '750px'}).afterClosed().subscribe(result => {
      this.getCuentasActivas();
    });
  }

  /** (MS) - Cerrar el componente tipo dialogo */
  cerrar() {
    this.dialogRef.close();
  }
}
