import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {AlarmasService} from '../../services/alarmas/alarmas.service';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';
import {InstrumentosService} from '../../services/instrumentos/instrumentos.service';
import {EmpresasService} from '../../services/empresas/empresas.service';

@Component({
  selector: 'app-filter-alarmas',
  templateUrl: './filter-alarmas.component.html'
})
export class FilterAlarmasComponent implements OnInit {

  mediosDePago = [];
  empresas = [];
  estados = [];

  _empresaValue: any[] = [];
  _mdpValue: any[] = [];
  _estadoValue: any[] = [];

  horaIni = '00:00:00';
  horaFin = '23:59:59';

  formAlarmas: FormGroup;

  constructor(
    private instrumentosServices: InstrumentosService,
    private empresasServices: EmpresasService,
    private router: Router,
    private fb: FormBuilder,
    private configDataPicker: NgbDatepickerConfig,
    private alarmasService: AlarmasService
  ) {
    /** (MS) - Inicializa los campos necesarios para crear una nueva asignacion de cuentas contables e instrumentos */
    this.formAlarmas = this.fb.group({
      inputFechaIni: new FormControl('', Validators.required),
      inputFechaFin: new FormControl('', Validators.required),
      fechaini: '',
      fechafin: '',
      tipo: '',
      empresa: '',
      estado: '',
      userName: '',
      peticion: ''
    });

    /** (MS) - Recupera la fecha actual del sistema y se almacena en la variable fechaIni y fechaFin */
    const date = new Date();
    this.formAlarmas.controls.inputFechaIni.setValue({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
    this.formAlarmas.controls.inputFechaFin.setValue({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
  }

  ngOnInit() {
    /** (MS) - Recupera la fecha actual del sistema y bloquea las fechas posteriores a esta en el campo de fecha */
    const currentDate = new Date();
    this.configDataPicker.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};
    this.configDataPicker.outsideDays = 'hidden';

    this.getMdp();
    this.getEmpresas();
    this.estados = this.alarmasService.getEstados();
  }

  /** (MS) - Recupera los meidos de pago
   * @method getInstrumentos Se conecta con el Servicio RSUMB */
  getMdp() {
    this.instrumentosServices.getMediosPago().subscribe((response: any) => {
      this.mediosDePago = response.mediospago;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Recupera las empresas
   * @method getEmpEps Se conecta con el Servicio RSUMB */
  getEmpresas() {
    this.empresasServices.getEmpEps().subscribe((response: any) => {
      this.empresas = response.rows;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  enviarFiltro() {
    const fechaIni = this.formatoFechaString(this.formAlarmas.getRawValue().inputFechaIni, this.horaIni);
    const fechaFin = this.formatoFechaString(this.formAlarmas.getRawValue().inputFechaFin, this.horaFin);
    this.formAlarmas.patchValue({fechaini: fechaIni});
    this.formAlarmas.patchValue({fechafin: fechaFin});
    this.formAlarmas.patchValue({tipo: this._mdpValue});
    this.formAlarmas.patchValue({empresa: this._empresaValue});
    this.formAlarmas.patchValue({estado: this._mdpValue});

    $('.page-loading').css({ 'z-index': '999', 'opacity': '1' });
    $('div').removeClass('.filter-style .customizer.open');

    this.router.navigate(['/analisis-financiero/alarmas', JSON.stringify(this.formAlarmas.getRawValue())],
      { queryParams:  filter, skipLocationChange: true});

    $('#acquirers-filter').removeClass('open');
  }

  limpiar() {

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

}
