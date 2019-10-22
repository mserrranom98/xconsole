import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EmpRexsService} from '../../../pages/pages-services/serv-emp-rec/emp-rexs.service';
import {SucursalesService} from '../../../pages/pages-services/serv-emp-rec/sucursales.service';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UsuarioSucursalService} from '../../services/usuario-sucursal/usuario-sucursal.service';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';

@Component({
  selector: 'app-filter-turnos',
  templateUrl: './filter-turnos.component.html'
})
export class FilterTurnosComponent implements OnInit {
  formTurnos: FormGroup;

  fechaIni: any;
  fechaFin: any;
  horaIni = '00:00:00';
  horaFin = '23:59:59';

  empresas = [];
  sucursales = [];

  disableSucursal = true;
  disableEmpresa = null;

  constructor(
    private fb: FormBuilder,
    private empresasService: EmpRexsService,
    private sucursalesService: SucursalesService,
    private configDataPicker: NgbDatepickerConfig,
    private router: Router,
    private usuariosService: UsuarioSucursalService
  ) {
    /** (MS) - Inicializa los campos necesarios para crear una nueva asignacion de cuentas contables e instrumentos */
    this.formTurnos = this.fb.group({
      inputIni: new FormControl('', Validators.required),
      fechaini: '',
      inputFin: new FormControl('', Validators.required),
      fechafin: '',
      rex: new FormControl('', Validators.required),
      sucursal: new FormControl('', Validators.required),
      userName: '',
      peticion: ''
    });
  }

  ngOnInit() {
    const currentDate = new Date();
    this.configDataPicker.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};
    this.configDataPicker.outsideDays = 'hidden';

    this.getEmpresas();
    this.getUsuarioSucursal();
  }

  getUsuarioSucursal() {
    this.usuariosService.getUsuarioUserName().subscribe((response: any) => {
      if (Number(response.rowCount) > 0) {
        this.disableEmpresa = true;
        this.formTurnos.patchValue({rex: response.usuarios[0].rex});

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

  getEmpresas() {
    this.empresasService.getRex().subscribe((response: any) => {
      this.empresas = response.rexs;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  enviarFiltro() {
    if (this.formTurnos.valid) {
      const startDate = this.formatoFechaString(this.formTurnos.getRawValue().inputIni, this.horaIni);
      const endDate = this.formatoFechaString(this.formTurnos.getRawValue().inputFin, this.horaFin);
      this.formTurnos.patchValue({fechaini: startDate});
      this.formTurnos.patchValue({fechafin: endDate});

      this.router.navigate(['/general/operaciones/consultas/turnos', JSON.stringify(this.formTurnos.getRawValue())],
        {queryParams: filter, skipLocationChange: true});

      $('#acquirers-filter').removeClass('open');
    } else {
      swal('Turnos', 'Se deben completar todos los campos antes de realizar la busqueda', 'error');
    }
  }

  limpiar() {
    this.formTurnos.reset();
    this.getUsuarioSucursal();

    this.disableSucursal = true;
  }

  /** (MS) - Convierte la variable fechaIni en el formato fecha YYYY-MM-dd HH:mm:ss
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
