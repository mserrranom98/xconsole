import {Component, OnInit} from '@angular/core';
import swal from 'sweetalert2';
import {NgbDateCustomParserFormatter} from 'app/pipes/date-format.pipe';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {InstrumentosService} from '../../../../shared/services/instrumentos/instrumentos.service';
import {EmpresasService} from '../../../../shared/services/empresas/empresas.service';
import {ListasService} from '../../../../shared/services/listas/listas.service';

@Component({
  selector: 'app-instrumentos',
  templateUrl: './instrumentos.component.html',
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ]
})

export class InstrumentosComponent implements OnInit {

  instrumentos = [];
  empresas = [];
  interacciones = [];
  tipos = [];

  estados = [
    { id: 'S', value: 'Bloqueado'},
    { id: 'N', value: 'Habilitado'},
  ];

  editar = false;

  noDataText = 'No hay datos que mostrar';

  constructor(
    private instrumentosService: InstrumentosService,
    private empresasServices: EmpresasService,
    private route: ActivatedRoute,
    private listasService: ListasService
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['fi'] != null && params['fi'] !== 'undefined') {
        $('.page-loading').css({'z-index': '999', 'opacity': '1'});
        const filterIns = JSON.parse(params['fi']);
        this.getInstrumentos(filterIns);
      } else {
        const filterOpe = [{
          tipoIndustria: '',
          industria: '',
          empresa: '',
          tipo: '',
          standIn: '',
          bloqueado: ''
        }];
        this.getInstrumentos(filterOpe[0]);
      }
    });

    this.getTipos();
    this.getEmpresas();
    this.getInteraccions();
  }

  /** (MS) - Recupera los tipos de instrumento
   * @method getListasDet Se conecta con el Servicio RSUMB */
  getTipos() {
    this.listasService.getListasDet('INSTIP').subscribe((response: any) => {
      this.tipos = response.items;
      console.log(this.tipos);
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

  /** (MS) - Recupera las interacciones
   * @method getListasDet Se conecta con el Servicio RSUMB */
  getInteraccions() {
    this.listasService.getListasDet('INTEMP').subscribe((response: any) => {
      this.interacciones = response.items;
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  getInstrumentos(filter) {
    this.editar = filter.empresa !== '';

    this.instrumentosService.getInstrumentosFull(filter).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Instrumentos', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
      } else {
        this.instrumentos = response.instrumentos;
        console.log(this.instrumentos);
        $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
      }
    }, error => {
      console.log(error);
    });
  }

  addIns(event) {}

  editarIns(event) {}

  validarIns(event) {}

  onEditorPreparing(event) {}
}
