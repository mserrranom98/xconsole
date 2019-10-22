import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmpresasService } from 'app/shared/services/empresas/empresas.service';
import { Router } from '@angular/router';
import { SucursalesService } from 'app/shared/services/sucursales/sucursales.service';
import { TerminalesService } from 'app/shared/services/terminales/terminales.service';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import {UsuarioSucursalService} from '../../services/usuario-sucursal/usuario-sucursal.service';

@Component({
  selector: 'app-filter-journal',
  templateUrl: './filter-journal.component.html'
})
export class FilterJournalComponent implements OnInit {

  @Output() filterJou = new EventEmitter<any[]>();

  fechaIni: any;
  fechaFin: any;
  horaIni = '00:00:00';
  horaFin = '23:59:59';

  empresasREX = [];
  sucursales = [];
  terminales = [];

  formJournal: FormGroup;

  sucursalArray = [];

  dropdownSettings = {};
  msj = '';

  disableEmpresa = null;
  disableTerminal = true;
  disableSucursal = true;

  constructor(
    private empresasService: EmpresasService,
    private router: Router,
    private usuariosService: UsuarioSucursalService,
    private sucursalesService: SucursalesService,
    private terminalesService: TerminalesService,
    private configDataPicker: NgbDatepickerConfig,
    private fb: FormBuilder
  ) {
    /** (MS) - Inicializa los campos necesarios para crear una nueva asignacion de cuentas contables e instrumentos */
    this.formJournal = this.fb.group({
      inputFechaIni: new FormControl('', Validators.required),
      inputFechaFin: new FormControl('', Validators.required),
      startDate: '',
      endDate: '',
      rex: new FormControl(''),
      terminal: new FormControl(''),
      sucursalList: new FormControl(''),
      userName: '',
      peticion: ''
    });

    /** (MS) - Recupera la fecha actual del sistema y se almacena en la variable fechaIni y fechaFin */
    const date = new Date();
    this.formJournal.controls.inputFechaIni.setValue({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
    this.formJournal.controls.inputFechaFin.setValue({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });

  }
  ngOnInit() {
    /** (MS) - Recupera la fecha actual del sistema y bloquea las fechas posteriores a esta en el campo de fecha */
    const currentDate = new Date();
    this.configDataPicker.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    this.configDataPicker.outsideDays = 'hidden';

    this.getEmpresasRex();
    this.getUsuarioSucursal();
  }

  getUsuarioSucursal() {
    this.usuariosService.getUsuarioUserName().subscribe((response: any) => {
      if (Number(response.rowCount) > 0) {
        this.disableEmpresa = true;
        this.formJournal.patchValue({rex: response.usuarios[0].rex});

        for (const sucursalResponse of response.usuarios) {
          const sucursal = {
            sucursal: sucursalResponse.sucursal,
            descripcion: sucursalResponse.sucursalGlosa
          };

          this.sucursales.push(sucursal);
        }
        this.disableSucursal = null;
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  getEmpresasRex() {
    this.empresasService.getRex().subscribe((response: any) => {
      this.empresasREX = response.rexs;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  getSucursales(event) {
    if (event.target.value !== '') {
      this.sucursalesService.getSuc(event.target.value).subscribe((response: any) => {
        this.sucursales = response.sucursales;
        this.disableSucursal = null;
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
    } else {
      this.sucursales = [];
      this.disableSucursal = true;
    }
  }

  getTerminales(event) {
    if (event.target.value !== '') {
      const valor = event.target.value;
      const sucursalList = [valor];
      this.sucursalArray = sucursalList;
      if (sucursalList.length === 1 && this.formJournal.getRawValue().rex) {
        this.terminalesService.getTerList(sucursalList, this.formJournal.getRawValue().rex).subscribe((response: any) => {
          this.terminales = response.terminales;
          this.disableTerminal = null;
        }, error => {
          console.log('Error: ' + JSON.stringify(error));
        });
      }
    } else {
      this.terminales = [];
      this.disableTerminal = true;
    }

  }

  enviarFiltro() {
    if (this.validarFecha()) {
      const startDate = this.formatoFechaString(this.formJournal.getRawValue().inputFechaIni, this.horaIni);
      const endDate = this.formatoFechaString(this.formJournal.getRawValue().inputFechaFin, this.horaFin);
      this.formJournal.patchValue({ startDate: startDate });
      this.formJournal.patchValue({ endDate: endDate });
      this.router.navigate(['/general/operaciones/consultas/journal', JSON.stringify(this.formJournal.getRawValue())],
        { queryParams: filter, skipLocationChange: true });

      this.msj = '';

      $('#acquirers-filter').removeClass('open');
    }

  }

  /** (MS) - Devuelve un string fecha con el formato YYYY-MM-dd hh:mm:ss
   * @return fecha */
  formatoFechaString(fecha: any, hora: string): String {
    let dd = fecha.day.toString();
    let mm = fecha.month.toString();

    if (fecha.day < 10) {
      dd = '0' + fecha.day;
    }
    if (fecha.month < 10) {
      mm = '0' + fecha.month;
    }

    return fecha.year + '-' + mm + '-' + dd + ' ' + hora;
  }

  validarFecha(): boolean {

    const startDate = this.formatoFechaString(this.formJournal.getRawValue().inputFechaIni, this.horaIni);
    const endDate = this.formatoFechaString(this.formJournal.getRawValue().inputFechaFin, this.horaFin);

    if (startDate > endDate) {
      this.msj = 'Fecha Desde es mayor a la Fecha Hasta. Verifique información';
      return false;
    }

    if (this.formJournal.getRawValue().rex === '') {
      this.msj = 'Empresa Rex Inválida. Verifique Información.';
      return false;
    }

    if (this.formJournal.getRawValue().sucursalList === []) {
      this.msj = 'Sucursal Inválida. Verifique Información.';
      return false;
    }

    if (this.formJournal.getRawValue().terminal === '') {
      this.msj = 'Terminal Inválida. Verifique Información.';
      return false;
    }
    return true;
  }

  limpiar() {
    this.formJournal.patchValue({ rex: '', terminal: '', sucursalList: '' });
    this.ngOnInit();
    this.terminales = [];
    this.sucursales = [];
  }

}
