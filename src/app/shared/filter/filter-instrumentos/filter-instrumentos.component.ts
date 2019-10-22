import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ListasService} from '../../services/listas/listas.service';
import {InstrumentosService} from '../../services/instrumentos/instrumentos.service';
import {UtilsService} from '../../services/utils/utils.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-filter-instrumentos',
  templateUrl: './filter-instrumentos.component.html'
})
export class FilterInstrumentosComponent implements OnInit {

  formInstrumento: FormGroup;

  tipoIndustria = [];
  industrias = [];
  interacciones = [];
  empresas = [];
  tipos = [];

  disableIndustria = true;
  disableEmpresa = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private instrumentosService: InstrumentosService,
    private utilsService: UtilsService,
    private listasService: ListasService
  ) { }

  ngOnInit() {
    this.formInstrumento = this.fb.group({
      tipoIndustria: '',
      industria: '',
      empresa: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      standIn: new FormControl('', Validators.required),
      bloqueado: new FormControl('', Validators.required)
    });

    this.getTipoIndustrias();
    this.getTipos();
    this.getInteraccions();
  }

  getTipoIndustrias() {
    this.instrumentosService.getTipoIndustria().subscribe((response: any) => {
      this.tipoIndustria = response.rows;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  getIndustrias() {
    if (this.formInstrumento.getRawValue().tipoIndustria === '') {
      this.disableIndustria = true;
      this.industrias = [];

      this.disableEmpresa = true;
      this.empresas = [];
    } else {
      this.disableIndustria = false;
      this.instrumentosService.getIndustria(this.formInstrumento.getRawValue().tipoIndustria).subscribe((response: any) => {
        this.industrias = response.rows;
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
    }
  }

  getEmpresas() {
    if (this.formInstrumento.getRawValue().industria === '') {
      this.disableEmpresa = true;
      this.empresas = [];
    } else {
      this.instrumentosService.getEmpresa(this.formInstrumento.getRawValue().industria).subscribe((response: any) => {
        this.empresas = response.rows;
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
      this.disableEmpresa = false;
    }
  }

  getTipos() {
    this.listasService.getListasDet('OPETIP').subscribe((response: any) => {
      this.tipos = response.items;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  getInteraccions() {
    this.listasService.getListasDet('INTEMP').subscribe((response: any) => {
      this.interacciones = response.items;
      $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  enviarFiltro() {
    this.router.navigate(['/esr/configuracion/instrumentos', JSON.stringify(this.formInstrumento.getRawValue())],
      { queryParams:  filter, skipLocationChange: true});

    $('#acquirers-filter').removeClass('open');
  }

  limpiar() {
    this.formInstrumento.reset();

    this.industrias = [];
    this.empresas = [];

    this.disableIndustria = true;
    this.disableEmpresa = true;
  }

}
