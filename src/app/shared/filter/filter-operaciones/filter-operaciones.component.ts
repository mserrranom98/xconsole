import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TerminalesService} from '../../services/terminales/terminales.service';
import {SucursalesService} from '../../services/sucursales/sucursales.service';
import {OperacionesService} from '../../../pages/pages-services/serv-general/operaciones.service';
import {ListasService} from '../../services/listas/listas.service';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';
import {EmpresasService} from '../../services/empresas/empresas.service';
import {InstrumentosService} from '../../services/instrumentos/instrumentos.service';
import {UsuarioSucursalService} from '../../services/usuario-sucursal/usuario-sucursal.service';

@Component({
  selector: 'app-filter-operaciones',
  templateUrl: './filter-operaciones.component.html'
})
export class FilterOperacionesComponent implements OnInit {

  @Output() filterOpe = new EventEmitter<any[]>();

  fechaIni: any;
  fechaFin: any;
  horaIni = '00:00:00';
  horaFin = '23:59:59';

  empresasREX = [];
  empresasEPS = [];
  sucursales = [];
  terminales = [];
  tipos = [];
  estados = [];
  instrumentos = [];
  mdps = [];

  formOperaciones: FormGroup;

  _sucursalValue: any[] = [];
  _terminalValue: any[] = [];
  _tipoValue: any[] = [];
  _estadoValue: any[] = [];
  _instrumentoValue: any[] = [];
  _mdpValue: any[] = [];

  dropdownSettings = {};
  ShowFilter = false;

  disableEmpresa = null;
  disableTerminal = true;
  disableSucursal = true;
  disableIns = true;

  constructor(
    private empresasService: EmpresasService,
    private router: Router,
    private sucursalesService: SucursalesService,
    private operacionesService: OperacionesService,
    private instrumentosService: InstrumentosService,
    private terminalesService: TerminalesService,
    private usuariosService: UsuarioSucursalService,
    private listasService: ListasService,
    private configDataPicker: NgbDatepickerConfig,
    private fb: FormBuilder
  ) {
    /** (MS) - Inicializa los campos necesarios para crear una nueva asignacion de cuentas contables e instrumentos */
    this.formOperaciones = this.fb.group({
      inputFechaIni: new FormControl('', Validators.required),
      inputFechaFin: new FormControl('', Validators.required),
      startDate: '',
      endDate: '',
      rex: new FormControl(''),
      eps: new FormControl(''),
      terminalList: new FormControl(''),
      sucursalList: new FormControl([]),
      tipoList: new FormControl([]),
      estadoList: new FormControl([]),
      instrumentoList: new FormControl([]),
      contexto: new FormControl([]),
      userName: '',
      peticion: ''
    });

    /** (MS) - Recupera la fecha actual del sistema y se almacena en la variable fechaIni y fechaFin */
    const date = new Date();
    this.formOperaciones.controls.inputFechaIni.setValue({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
    this.formOperaciones.controls.inputFechaFin.setValue({
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

    this.getEmpresasRex();
    this.getUsuarioSucursal();
    this.getEmpresasEPS();
    this.getTipos();
    this.getEstados();
    this.getMdps();
  }

  getUsuarioSucursal() {
    this.usuariosService.getUsuarioUserName().subscribe((response: any) => {
      if (Number(response.rowCount) > 0) {
        this.disableEmpresa = true;
        this.formOperaciones.patchValue({rex: response.usuarios[0].rex});

        for (const sucursalResponse of response.usuarios) {
          const sucursal = {
            sucursal: sucursalResponse.sucursal,
            descripcion: sucursalResponse.sucursalGlosa
          };

          this.sucursales.push(sucursal);
        }
        this.disableSucursal = false;
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

  getEmpresasEPS() {
    this.empresasService.getEmpEps().subscribe((response: any) => {
      for (let i = 0; i < response.rows.length; i++) {
        if (response.rows.codigo === 'EMPPAG') {
          response.rows.splice(i, 1);
        }
      }
      this.empresasEPS = response.rows;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  getSucursales(event) {
    if (event.target.value !== '') {
      this.sucursalesService.getSuc(event.target.value).subscribe((response: any) => {
        this.sucursales = response.sucursales;
        this.disableSucursal = false;
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
    } else {
      this.sucursales = [];
      this.disableSucursal = true;
    }
  }

  getTerminales() {
    if (this._sucursalValue.length === 1 && this.formOperaciones.getRawValue().rex) {
      this.terminalesService.getTerList(this._sucursalValue, this.formOperaciones.getRawValue().rex).subscribe((response: any) => {
        this.terminales = response.terminales;
        this.disableTerminal = false;
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
    } else {
      this.terminales = [];
      this.disableTerminal = true;
    }
  }

  getTipos() {
    this.listasService.getListasDet('OPETIP').subscribe((response: any) => {
      this.tipos = response.items;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  getEstados() {
    this.listasService.getListasDet('OPEEST').subscribe((response: any) => {
      this.estados = response.items;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  getInstrumentos(empresa) {
    this.instrumentosService.getInstrumentosEPS(empresa).subscribe((response: any) => {
      this.instrumentos = response.rows;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  getMdps() {
    this.instrumentosService.getMediosPago().subscribe((response: any) => {
      this.mdps = response.mediospago;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  selectEPS(event) {
    if (event.target.value === '') {
      this.disableIns = true;
      this.instrumentos = [];
    } else {
      this.disableIns = false;
      this.getInstrumentos(event.target.value);
    }
  }

  enviarFiltro() {
    const startDate = this.formatoFechaString(this.formOperaciones.getRawValue().inputFechaIni, this.horaIni);
    const endDate = this.formatoFechaString(this.formOperaciones.getRawValue().inputFechaFin, this.horaFin);
    this.formOperaciones.patchValue({startDate: startDate});
    this.formOperaciones.patchValue({endDate: endDate});
    this.formOperaciones.patchValue({sucursalList: this._sucursalValue});
    this.formOperaciones.patchValue({terminalList: this._terminalValue});
    this.formOperaciones.patchValue({tipoList: this._tipoValue});
    this.formOperaciones.patchValue({estadoList: this._estadoValue});
    this.formOperaciones.patchValue({instrumentoList: this._instrumentoValue.concat(this._mdpValue)});

    console.log(this.formOperaciones.getRawValue());

    this.router.navigate(['/general/operaciones/consultas/operaciones', JSON.stringify(this.formOperaciones.getRawValue())],
      { queryParams:  filter, skipLocationChange: true});

    $('#acquirers-filter').removeClass('open');
  }

  limpiar() {
    this.formOperaciones.reset();
    this._sucursalValue = [];
    this._terminalValue = [];
    this._tipoValue = [];
    this._estadoValue = [];
    this._instrumentoValue = [];
    this._mdpValue = [];
    this.getUsuarioSucursal();

    this.disableTerminal = true;
    this.disableSucursal = true;
    this.disableIns = true;
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
