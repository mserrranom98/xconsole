import {Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Input} from '@angular/core';
import swal from 'sweetalert2';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {NgForm, FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {
  ObtenerTipoCambio,
  CrearTipoCambio,
  ActualizarTipoCambio,
  BorrarTipoCambio,
  ListaMoneda,
  CargaMasivaTipoCambio
} from './tipocambio.model';
import {TipoCambioService} from './tipocambio.service'
import {NgbDateCustomParserFormatter} from 'app/pipes/date-format.pipe';


/*IMPORTS DEL MODAL*/
import {NgbDateParserFormatter, NgbDateStruct, NgbModal, ModalDismissReasons, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material';
import {CargaComponent} from './carga/carga.component';

@Component({
  selector: 'app-tipo-cambio',
  templateUrl: './tipocambio.component.html',
  styles: [],
  styleUrls: ['./tipocambio.component.scss'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ]
})

export class TipoCambioComponent implements OnInit {
  formTipo: FormGroup;


  noDataText = 'No hay datos que mostrar';


  @ViewChild(DatatableComponent) tblList: DatatableComponent;
  @ViewChild('panel', {read: ElementRef}) public panel: ElementRef;
  @ViewChild('f') f: NgForm;
  @Output() datos = new EventEmitter();
  @Input() tipo: string;
  tipoB = '';
  leerTipoCAmbio: ObtenerTipoCambio;
  guardarTipoCAmbio: CrearTipoCambio;
  editarTipoCambio: ActualizarTipoCambio;
  borrarTipoCAmbio: BorrarTipoCambio;
  tipoMoneda: ListaMoneda;
  cargaMasiva: CargaMasivaTipoCambio;
  list = [];
  opc = {};
  data = [];
  rows = [];
  temp = [];
  columns = [];
  selected = [];
  editing = {};
  divIU = false;
  disabled = false;
  divTipo = true;
  gestion = '';
  fechaIni: NgbDateStruct;
  fechaFin: NgbDateStruct;
  glosar: any[];
  item: [];
  monedaSec: any;
  monedaValor: any;
  fechaIn = '';
  fechaOt = '';
  archivo: any;

  closeResult: string;
  msj = '';
  today = '';
  visible = true;

  /*opc = new Object();
  data = [];
  rows: any[] = [];*/

  constructor(
    private fb: FormBuilder,
    private tipocambioService: TipoCambioService,
    private router: Router,
    private route: ActivatedRoute,
    private formatoFecha: NgbDateCustomParserFormatter,
    private modalService: NgbModal,
    private configDataPicker: NgbDatepickerConfig,
    public dialog: MatDialog
  ) {
    this.data = [];
    this.leerTipoCAmbio = new ObtenerTipoCambio('', '', '', '', '');
    this.guardarTipoCAmbio = new CrearTipoCambio('', '', '', '', '', '');
    this.editarTipoCambio = new ActualizarTipoCambio('', '', '', '', '', '', '');
    this.borrarTipoCAmbio = new BorrarTipoCambio('', '', '');
    this.tipoMoneda = new ListaMoneda('', '', '', '');
    this.cargaMasiva = new CargaMasivaTipoCambio('', '', '', '');
    this.formTipo = this.fb.group({
      inputIni: new FormControl('', Validators.required),
      fecha_desde: '',
      inputFin: new FormControl('', Validators.required),
      fecha_hasta: '',
      moneda: new FormControl('', Validators.required),
      userName: '',
      peticion: ''
    })
  }

  ngOnInit() {
    const currentDate = new Date();
    this.configDataPicker.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};
    this.configDataPicker.outsideDays = 'hidden';


    this.tipocambioService.getTipoMoneda(this.tipoMoneda).subscribe((response: any) => {
      console.log(response);
      if (response.code === '6996') {
        swal('Tipo Cambio', response.description + '. Verifique Servidor Netswitch', 'error');
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      } else {
        this.glosar = response.items;
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    }, error => {
      swal('TipoCambio', 'Disculpe las molestias, por favor contactarse con el administrador error: ' + error, 'error');
    });
  }


  buscar() {
    this.opc = {};
    this.data = [];
    if (this.formTipo.valid) {

      const fecha1 = this.formatoFechaString(this.formTipo.getRawValue().inputIni, '00:00:00');
      this.formTipo.patchValue({fecha_desde: fecha1});
      const fecha2 = this.formatoFechaString(this.formTipo.getRawValue().inputFin, '23:59:59');
      this.formTipo.patchValue({fecha_hasta: fecha2});

      console.log(this.formTipo.getRawValue());

      this.tipocambioService.getTipoCAmbio(this.formTipo.getRawValue()).subscribe((response: any) => {
        if (response.code === '0') {
          this.data = response.tipocambio;
          console.log(this.data);
        } else {
          swal('TipoCambio', response.description + '. Contactarse con el administrador', 'error');
        }
      }, error => {
        console.log(error);
      });

    } else {
      swal('turnos', 'se deben de completar todos los campos antes', 'error');
    }
  }


  formatoFechaString(fecha: any, hora: string): String {
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


  addCuenta(row) {

    this.tipocambioService.postTipoCAmbio(row.data).subscribe(
      (response: any) => {
        console.log(response);
        if (response.code === '0') {
          swal('Tipo Cambio', 'Registro Creado con Exito', 'success');
          this.buscar();
        } else {
          console.log(response);
          swal('Tipo Cambio', response.description + '. Verifique Información', 'error');
          this.buscar();
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
        this.buscar();
      }
    )
  }


  onEditar(row) {
    this.tipocambioService.putTipoCAmbio(row.data).subscribe(
      (response: any) => {
        if (response.code === '0') {
          swal('Tipo Cambio', 'Registro Actualizado con Exito', 'success');
          this.buscar();
        } else {
          swal('Tipo Cambio', ' NO SE PUEDE MODIFICAR ESTE TIPO DE CAMBIO, POR QUE LA FECHA DE VIGENCIA ES MENOR A LA DE HOY', 'error');
          this.buscar();
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
        this.buscar();
      }
    )
  }


  eliminar(row) {
    console.log(row);
    swal({
      title: 'Advertencia!',
      type: 'warning',
      text: '',
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.tipocambioService.deleteTipoCAmbio(row.data).subscribe(
          (response: any) => {
            if (response.code === '0') {
              swal('Tipo Cambio', 'Registro Eliminado', 'success');

              this.buscar();
            } else {
              swal('Tipo Cambio', 'Registro No ha sido Eliminado', 'error');
              this.buscar();
            }
          },
          error => {
            console.log(<any>error);
            this.buscar();
          });
      } else {
        swal('Tipo Cambio', 'Registro No ha sido Eliminado', 'warning');
        this.buscar();
      }
    });

  }

  onSelect(rowIndex) {
    this.datos.emit(JSON.stringify(this.rows[rowIndex].idtipoCambio));
  }

  onEditorPreparing(e) {
    if (!e.row.inserted && e.dataField === 'moneda') {
      e.editorOptions.disabled = true;
    }
  }

  openCarga2() {
    this.dialog.open(CargaComponent, {width: '700px', height: 'auto', maxHeight: '750px'});
  }

  open(content) {
    this.msj = '';

    this.tipocambioService.getIndicadores().subscribe(
      (responsea: any) => {
        $('#loading').css('display', 'none');
        $('#tabla1').append('<tr>');
        $('#tabla1').append('<th scope="row">' + responsea.uf.valor + '</th>');
        $('#tabla1').append('<td>' + responsea.dolar.valor + '</td>');
        $('#tabla1').append('<td>' + responsea.dolar_intercambio.valor + '</td>');
        $('#tabla1').append('<td>' + responsea.euro.valor + '</td>');
        $('#tabla1').append('<td>' + responsea.utm.valor + '</td>');
        $('#tabla1').append('<td>' + responsea.ivp.valor + '</td>');
        $('#tabla1').append('</tr>');
        console.log(JSON.stringify(this.rows));
      },
      error => {
        this.msj = 'Servicio no disponible';
        console.log('Error: ' + JSON.stringify(error));
      }
    );

    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // This function is used in open
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /*
  Aquí Terminan las funciones del MODAL
  */
  openCarga(content2) {

    this.modalService.open(content2, {size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }


  enviarArchivo() {
    this.cargaMasiva.archivo = this.archivo;
    this.cargaMasiva.moneda = this.leerTipoCAmbio.moneda;
    this.tipocambioService.postArchivo(this.cargaMasiva).subscribe(
      (responsea: any) => {
        if (responsea.code === '91') {
          swal('Tipo Cambio', 'Error carga: ' + ' NO SE PUEDE CREAR ESTE TIPO DE CAMBIO, POR QUE LA FECHA DE VIGENCIA ES MENOR A LA DE HOY', 'error');
        } else {
          swal('Tipo Cambio', 'completada', 'success');
        }
      },
      error => {
        this.msj = 'Servicio no disponible' + error;
      }
    )
  }

  onCancel() {
    this.limpiar();
  }

  limpiar() {
    this.divIU = false;
    this.divTipo = true;
    this.fechaIni = null;
    this.fechaFin = null;
    this.monedaSec = '';
    this.monedaValor = '';
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.archivo = myReader.result;
    };
    myReader.readAsDataURL(file);

  }

}
