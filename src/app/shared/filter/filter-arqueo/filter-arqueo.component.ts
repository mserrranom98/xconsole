import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EmpresasService} from '../../services/empresas/empresas.service';
import {SucursalesService} from '../../../pages/pages-services/serv-emp-rec/sucursales.service';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UsuarioSucursalService} from '../../services/usuario-sucursal/usuario-sucursal.service';

@Component({
  selector: 'app-filter-arqueo',
  templateUrl: './filter-arqueo.component.html'
})
export class FilterArqueoComponent implements OnInit {
  fecha: any;

  formArqueo: FormGroup;

  empresas = [];
  sucursales = [];

  disableEmpresa = null;
  disableSucursal = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private empresasService: EmpresasService,
    private usuariosService: UsuarioSucursalService,
    private sucursalesService: SucursalesService,
    private configDataPicker: NgbDatepickerConfig,
  ) {
    /** (MS) - Inicializa los campos necesarios para crear una nueva asignacion de cuentas contables e instrumentos */
    this.formArqueo = this.fb.group({
      inputFecha: new FormControl('', Validators.required),
      fecha: '',
      empresa: new FormControl('', Validators.required),
      sucursal: new FormControl('', Validators.required),
      userName: '',
      peticion: ''
    });
  }

  ngOnInit() {
    /** (MS) - Recupera la fecha actual del sistema y bloquea las fechas posteriores a esta en el campo de fecha */
    const currentDate = new Date();
    this.configDataPicker.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};
    this.configDataPicker.outsideDays = 'hidden';

    this.getEmpresasRex();
    this.getUsuarioSucursal();
  }

  getUsuarioSucursal() {
    this.usuariosService.getUsuarioUserName().subscribe((response: any) => {
      if (Number(response.rowCount) > 0) {
        this.disableEmpresa = true;
        this.formArqueo.patchValue({empresa: response.usuarios[0].rex});

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
      this.empresas = response.rexs;
      $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
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

  enviarFiltro() {
    const fecha = this.formatoFechaString(this.formArqueo.getRawValue().inputFecha);
    this.formArqueo.patchValue({ fecha: fecha });

    this.router.navigate(['/general/operaciones/consultas/arqueo', JSON.stringify(this.formArqueo.getRawValue())],
      { queryParams: filter, skipLocationChange: true });

    $('#acquirers-filter').removeClass('open');
  }

  /** (MS) - Convierte la variable fechaIni en el formato fecha YYYYMMdd
   * @return fecha */
  formatoFechaString(fecha): String {
    let dd = fecha.day.toString();
    let mm = fecha.month.toString();

    if (fecha.day < 10) {
      dd = '0' + fecha.day;
    }
    if (fecha.month < 10) {
      mm = '0' + fecha.month;
    }

    return fecha.year + mm + dd;
  }

  limpiar() {
    this.formArqueo.reset();
  }
}
