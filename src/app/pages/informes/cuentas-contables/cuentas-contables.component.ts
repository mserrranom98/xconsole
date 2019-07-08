import {Component, OnInit, ViewChild} from '@angular/core';
// Funcionamiento
import {
  CCIDelete,
  CCIInsert,
  CCISelect,
  CrearCuentas,
  CuentaContableActiva,
  CuentasSelect,
  EditarCuentas,
  InstrumentoNoPago,
  MediosPago,
  VoucherExport,
  VoucherSelect
} from './model-cuentasContables';
import {CuentaContableService} from './cuentas-contables.service'
import {NgbDateCustomParserFormatter} from 'app/pipes/date-format.pipe';
import swal from 'sweetalert2';
import {RexSelect} from 'app/pages/pages-models/model-emp-rec';
import {EmpRexsService} from 'app/pages/pages-services/serv-emp-rec/emp-rexs.service';
/*IMPORTS DEL MODAL*/
import {ModalDismissReasons, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DatatableComponent} from '@swimlane/ngx-datatable';


import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';



@Component({
  selector: 'app-cuentas-contables',
  templateUrl: './cuentas-contables.component.html',
  styleUrls: ['./cuentas-contables.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class CuentasContablesComponent implements OnInit {
  fechaIni: NgbDateStruct;

  @ViewChild(DatatableComponent) tblList: DatatableComponent;
  temp = [];


  // inicializado los servicios(1)
  datosVoucher: VoucherSelect;
  exportarVou: VoucherExport;
  datosCuentas: CuentasSelect;
  editarCuentas: EditarCuentas;
  insertarCuentas: CrearCuentas;

  instrumentoNoPago: InstrumentoNoPago;
  mediosPago: MediosPago;
  cuentaActiva: CuentaContableActiva;

  cciInsert: CCIInsert;
  cciSelect: CCISelect;
  cciDelete: CCIDelete;
  opcI = {};

  // Arrays respuestas para las tablas de los servicios(2) generalmente los SELECTS
  dataVoucher: any[] = [];
 // dataVoucher = [];
  dataCuenta = [];

  dataSelectIns = [];
  dataSelectMed = [];
  dataSelectCueA = [];

  dataCCIS = [];

  // modal
  closeResult: string;
  msj = '';
  today = '';
  visible = true;

  // Para editar y crear cuentas
  rows2 = [];
  rows = []; // este contiene la respuesta de lo buscado, pero para ser tomado o transformado o bla bla bla, para trabajar con la respuesta
  soloEditar = true;
  guardar = false;

  nuevo = false;

  // select sucursal
  rexSelect: RexSelect;
  listEmpRex: any[];

  // Declaraciones para modificaciones
  // Medio de pago
  instrumentoon = false;
  mdepagoon = false;
  botonguardar = false;
  dspsdebuscar = false;

  tipo: string;

  constructor(
    private cuentasContablesServices: CuentaContableService,
    private formatoFecha: NgbDateCustomParserFormatter,

    // MODAL
    private modalService: NgbModal,

    // trer info select
    private empRexsService: EmpRexsService,

    // Clase para configurar atributos de DataPicker
    private configDataPicker: NgbDatepickerConfig
  ) {
    this.rexSelect = new RexSelect('', '');

    /* MAPEADO PARA SERVICIO */
    this.datosVoucher = new VoucherSelect('', '', '');
    this.exportarVou = new VoucherExport('', '', '');
    this.datosCuentas = new CuentasSelect('', '', '');
    this.editarCuentas = new EditarCuentas('', '', '', '', '', '', '');
    this.insertarCuentas = new CrearCuentas('', '', '', '', '', '');

    this.instrumentoNoPago = new InstrumentoNoPago('', '');
    this.mediosPago = new MediosPago('', '');
    this.cuentaActiva = new CuentaContableActiva('', '');

    this.cciSelect = new CCISelect('', '');
    this.cciInsert = new CCIInsert('', '', '', '', '', '');
    this.cciDelete = new CCIDelete('', '', '', '');
    /* FIN MAPEADO */
   }

  ngOnInit() {

    // Validar campo de fechas segun el dia actual
    const currentDate = new Date();
    this.configDataPicker.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};

    this.configDataPicker.outsideDays = 'hidden';

    /* INICIANDO LOS SELECT */

    // INSTRUMENTOS SIN MEDIOS DE PAGO
    this.cuentasContablesServices.getInstrumentoNoPago(this.instrumentoNoPago).subscribe(
      (response: any) => {
        this.dataSelectIns = response.instrumentonopago;
        console.log(this.dataSelectIns);
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    );

    // MEDIOS DE PAGO
    this.cuentasContablesServices.getMediosPago(this.mediosPago).subscribe(
      (response: any) => {
        this.dataSelectMed = response.mediospago;
      //  console.log(this.dataSelectMed);
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    );

    // CUENTA CONTABLE ACTIVA
    this.cuentasContablesServices.getCuentaActiva(this.cuentaActiva).subscribe(
      (response: any) => {
        this.dataSelectCueA = response.cuentacontableactiva;
        console.log(this.dataSelectCueA); // esto me trae completo
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
    /* fin INICIANDO LOS SELECT */
  }

  buscar() {
    this.cuentasContablesServices.getVoucher(this.datosVoucher).subscribe(
      (response: any) => {
          if (response.code !== '0' ) {
              swal('Voucher', 'Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
              $('#loading').css('display', 'none');
          } else {

                this.dataVoucher = response.voucher;
                this.temp = this.dataVoucher;
                // console.log(this.dataVoucher);
                 this.dspsdebuscar = true;
             }
      }
    )
  }





  exportarXLSX() {

    // Comienzo de exportación web excel
    const ws = XLSX.utils.aoa_to_sheet([
      /*['BANCO CONSORCIO'],
      ['Voucher Contable'],
      [],*/
    ]);
                                  // Dato a pasar    //Donde empieza a poner la tabla
    XLSX.utils.sheet_add_json(ws, this.dataVoucher, { origin: 'A1' });

    // Donde crea el libro
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Voucher');

    // Tamaño de las columnas
    ws['!cols'] = [{width: 18}, {width: 18}, {width: 18}, {width: 18}, {width: 18},
      {width: 25}, {width: 25}, {width: 18}, {width: 18}, {width: 18}, {width: 18}];

    // no se para que sirve
    const workbook: XLSX.WorkBook = { Sheets: { 'Voucher': ws }, SheetNames: ['Voucher'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true });

    /* aqui consigue la fecha en formato para dar el nombre
    const d = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const fecha = d.getDate() + '_' + months[d.getMonth()] + '_' + d.getFullYear(); */

    // Manda  a guardar con el nombre al final
    this.saveAsExcelFile(excelBuffer, 'Voucher' + this.datosVoucher.fechacons);


    this.buscar();
    swal('Operaciones', 'Ha sido correcta la exportación de operaciones :' , 'success');
    $('#loading').css('display', 'none');
}

private saveAsExcelFile(buffer: any, fileName: string): void {
const data: Blob = new Blob([buffer], {
type: EXCEL_TYPE
});
FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
}









  validaFecha(fecha) {


       this.fechaIni = fecha;
       const fechaA = this.fechaIni.year + '-' + this.fechaIni.month + '-' + this.fechaIni.day;

       this.formatoFechaHora(new Date(fechaA));


   }

     formatoFechaHora(fecha: Date): string {
       let dd: string;
       let mm: string;
       /*let hh: string;
       let mi: string;
       let ss: string;*/

       if (fecha.getDate() < 10) {
         dd = '0' + fecha.getDate();
       } else {
         dd = fecha.getDate().toString();
       }
       if (fecha.getMonth() < 10) {
         mm = '0' + (fecha.getMonth() + 1);
       } else {
         mm = (fecha.getMonth() + 1).toString()
       }
       /*if (fecha.getHours() < 10) {
         hh = '0' + fecha.getHours();
       } else {
         hh = fecha.getHours().toString();
       }
       if (fecha.getMinutes() < 10) {
         mi = '0' + fecha.getMinutes();
       } else {
         mi = fecha.getMinutes().toString();
       }
       if (fecha.getSeconds() < 10) {
         ss = '0' + fecha.getSeconds();
       } else {
         ss = fecha.getSeconds().toString();
       }*/

       this.datosVoucher.fechacons = fecha.getFullYear() + mm + dd;
      // console.log(fecha.getFullYear()+ mm +dd);

       return dd + mm + fecha.getFullYear() ;
     }

      exportar() {
        this.exportarVou.fechacons = this.datosVoucher.fechacons;
        // console.log(this.exportarVou.fechacons);


        this.cuentasContablesServices.getExportVoucher(this.exportarVou).subscribe(
          (response: any) => {


              if (response.code !== '0' ) {
                  swal('Exportar', 'Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
                  $('#loading').css('display', 'none');
              } else {

                swal('Voucher', 'Exportado con Exito', 'success');
                 }


          }
        )

      }


     // Función MODAL
     open(content) {

      this.msj = '';


       this.datosCuentas.activo = 'S';
       this.buscarCuenta();

      this.modalService.open(content, { size: 'lg' }).result.then((result) => {
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



    buscarCuenta() {


      this.cuentasContablesServices.getCuentas(this.datosCuentas).subscribe(
        (response: any) => {
            if (response.code !== '0' ) {
                swal('Cuentas', 'Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
                $('#loading').css('display', 'none');
            } else {

                  this.dataCuenta = response.cuentascontables;
                  // console.log(this.dataCuenta);
               }

               this.rows = this.dataCuenta;
        }
      )

    }

    editar(rowIndex) {
// ESTA FUNCIÓN ES PARA TOMAR LOS DATOS PROVINIENTES DE LA TABLA

      const obj = this.rows[rowIndex];
     // console.log(rowIndex);
      // Me trae la posicion de la tabla


      this.editarCuentas.cuenta = obj['cuenta'].toString();
      // Recordar usar "readonly" en el html pa que no toquen el numero de cuenta
      this.editarCuentas.producto = obj['producto'].toString();
      this.editarCuentas.glosaCuenta = obj['glosaCuenta'].toString();
      this.editarCuentas.centroCosto = obj['centroCosto'].toString();
      this.editarCuentas.activo = obj['activo'].toString();
     // console.log(this.editarCuentas.activo);

      this.soloEditar = false;
      this.guardar = true;


    }

    cancelar() {
      this.guardar = false;
      this.soloEditar = true;
      this.nuevo = false;
    }

    abrirNuevo() {
      this.soloEditar = false;
      this.nuevo = true;
    }

    editName(): void {
      if (this.insertarCuentas.cuenta.length === 0 ) {
        $('#cuentaI').focus();
        swal('Cuenta Contable', 'N° de cuenta no puede estar vacio', 'error');

      } else {
       this.guardarNuevo();
      }

      this.cancelar();
      this.buscarCuenta();

    }

    RequisitoCeliaCTM() {
          // CUENTA CONTABLE ACTIVA
    this.cuentasContablesServices.getCuentaActiva(this.cuentaActiva).subscribe(
      (response: any) => {
        this.dataSelectCueA = response.cuentacontableactiva;
      //  console.log(this.dataSelectCueA); // eso me trae completo
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
    }

    guardarNuevo() {

     // console.log(this.insertarCuentas.cuenta);

        this.cuentasContablesServices.getCrearCuenta(this.insertarCuentas).subscribe(
          (response: any) => {

            if (response.code === '0') {
              swal('Cuenta Contable', 'Registro Creado con Exito', 'success');
            } else {
              swal('Cuenta Contable', response.description + '. Verifique Información', 'error');
            }
          },
          error => {
            console.log('Error: ' + JSON.stringify(error));
          }

        );
        setTimeout(() => {
          this.buscarCuenta();
        }, 1000);


        this.insertarCuentas = new CrearCuentas('', '', '', '', '', '');
        this.RequisitoCeliaCTM();
        console.log(this.dataSelectCueA);

    }

    onEditar() {

      this.cuentasContablesServices.getEditarCuenta(this.editarCuentas).subscribe(
        (response: any) => {

          if (response.code === '0') {
            swal('Cuenta Contable', 'Registro Editado con Exito', 'success');
          } else {
            swal('Cuenta Contable', response.description + '. Verifique Información', 'error');
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      );

      this.cancelar();



      // TIEMPO PARA PROCESAR LA INFORMAWEACION
        setTimeout(() => {
          this.buscarCuenta();
        }, 1000);

        this.RequisitoCeliaCTM();
        console.log(this.dataSelectCueA);


    }

      // Función SEGUNDO MODAL
      open2(content2) {


        this.buscarCCI();


        this.modalService.open(content2, { size: 'lg' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
      // FIN SEGUNDO MODAL

      buscarCCI() {

        this.cuentasContablesServices.getCCISelect(this.cciSelect).subscribe(
          (response: any) => {
              if (response.code !== '0' ) {
                  swal('CCI', 'Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
                  $('#loading').css('display', 'none');
              } else {

                     this.dataCCIS = response.cci;
                     // console.log(this.dataCCIS);

                  //   if (response.rowCount !== '0') {
                  //   for (let i = 0; i < response.rowCount; i++) {
                  //     this.opcI = {
                  //       cuenta: response.rows[i].cuenta,
                  //       instrumento: response.rows[i].instrumento,
                  //       medioPago: response.rows[i].medioPago
                  //     }
                  //     if(response.cci.medioPago == "ANULAD"){

                  //       response.cci.medioPago = "Anulado"

                  //     }else{
                  //       if(response.cci.medioPago == "VIGENT"){
                  //         response.cci.medioPago = "Vigente"
                  //     }
                  //  }
                  //     this.dataCCIS[i] = this.opcI;
                  //   }
                  // }




                     this.rows2 = this.dataCCIS;
                 }

                 this.rows2 = this.dataCCIS;
          }
        )

      }

    eliminarCCI(rowIndex2) {


      const obj2 = this.rows2[rowIndex2];
      // console.log(obj2);
      // Me trae la posicion de la tabla

      this.cciDelete.cuenta = obj2['cuenta'];
     // console.log(this.cciDelete.cuenta);
      // Esto me trae el resultado de 'cuenta' en la posicion en la tabla indicada por rowIndex

      this.cciDelete.tipoCuenta = obj2['tipoCuenta'];
     console.log(this.cciDelete.tipoCuenta);
      // Esto me trae el resultado de 'tipoCuenta' en la posicion en la tabla indicada por rowIndex

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

      ).then((result) => { // aquí se va a eliminar llamando al servicio
        if (result.value) {
          this.cuentasContablesServices.getCCIDelete(this.cciDelete).subscribe(
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
      /*
      Para este caso, se utiliza el modelo [this.cciInsert = new CCIInsert('','','','','');]
      Y esto tiene unos campos que se llaman cuenta instrumento medioPago
      Esos deben ser asignados en el HTML o en donde se van a buscar estos select (no es necesario) onda asignarles el nombre
      cciInsert.cuenta y volaas (si, funcionó como abajo lo demuestra la funcion mostrarCuenta(){})
      */

      /*
      Recordar usar disabled en los select para que no se seleccione el seleccione

      */

      // if(this.tipo == "anula"){
      //   this.cciInsert.medioPago = "ANULAD"
      // }else{
      //   this.cciInsert.medioPago= "VIGENT"
      // }


     this.cuentasContablesServices.getCCIInsert(this.cciInsert).subscribe(
      (response: any) => {

        if (response.code === '0') {
          swal('Cuenta Contable', 'Asignación creada con Exito', 'success');
          this.buscarCCI();
        } else {
          swal('Cuenta Contable, Instrumento', response.description + '. Verifique Información', 'error');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )


    }


    // ESTA FUNCION A CONTINUACIÓN  ESTÁ EN UN ONCHANGE DEL SELECT DE CUENTA CONTABLE ACTIVA PARA MOSTRAR COMO SE TRAE UN DATO DE UN SELECT
    muestraCuenta() {
     // console.log(this.cciInsert.cuenta);
    }

    ValidarCampos(): void {
      if (this.cciInsert.cuenta.length === 0 ) {
        swal('Cuenta Contable', 'N° de cuenta no puede estar vacio', 'error');

      } else {
       this.guardarCCI();
      }

    }

    tipomediodepago() {

     // console.log(this.tipo)

     if (this.tipo === 'ins' || this.tipo === 'anula') {
        this.instrumentoon = true;
        this.mdepagoon = false;
        this.botonguardar = true;
      } else {
          if (this.tipo === 'acm1pt') {
          this.mdepagoon = true;
          this.instrumentoon = false;
          this.botonguardar = true;
          }

        }

    }

    updateFilter(event) {
      const val = event.target.value.toLowerCase();
      this.dataVoucher = this.temp.filter(function (d) {
        return d.tipoCuenta.toLowerCase().indexOf(val) !== -1 || d.productoCuenta.toLowerCase().indexOf(val) !== -1;
      });
      this.tblList.offset = 0;
    }


}
