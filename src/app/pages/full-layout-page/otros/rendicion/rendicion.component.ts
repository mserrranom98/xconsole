import {Component, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {RendicionInsert, RendicionSelect} from '../../../pages-models/model-global';
import {ListasItems} from '../../../pages-models/model-emp-serv-rec';
import {RendicionService} from '../../../pages-services/serv-reca/rendicion.service';
import {ListasService} from '../../../pages-services/serv-emp-serv-rec/listas.services';
import {NGXToastrService} from './toastr.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-rendicion',
  templateUrl: './rendicion.component.html',
  styleUrls: ['./rendicion.component.scss'],
  providers: [NGXToastrService]
})
export class RendicionComponent implements OnInit {
  rendicionSelect: RendicionSelect;
  rendicionInsert: RendicionInsert;
  listaItems: ListasItems;
  itemList: any = [];
  listaCnsEmp: any = [];
  selected = [];
  settings = {};
  culo = '';

  @ViewChild(DatatableComponent) table: DatatableComponent;
  dataT = [];
  rows: any = [];
  divList = false;
  msj = '';

  constructor(
    private service: NGXToastrService,
    private rendicionService: RendicionService,
    private listasService: ListasService,
    private router: Router
  ) {
    this.rendicionSelect = new RendicionSelect('', '');
    this.rendicionInsert = new RendicionInsert('', '');
    this.listaItems = new ListasItems('', '', '');
  }

  ngOnInit() {
    $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
    this.selected = [];
    this.itemList = [];
    this.listasService.getListasDet('CNSREN').subscribe((response: any) => {
        if (response.items.length > 0) {
          for (let i = 0; i < response.items.length; i++) {
            const cnsEmp: Object = {
              cnsEmp: response.items[i].item,
              glosa: response.items[i].glosa
            };
            this.itemList[i] = cnsEmp;
            this.selected[i] = cnsEmp;
          }
          this.settings = {
            singleSelection: false,
            text: 'Seleccione...',
            selectAllText: 'Seleccione todo',
            unSelectAllText: 'Deseleccione todo',
            classes: 'myclass custom-class',
            primaryKey: 'cnsEmp',
            labelKey: 'glosa',
            noDataLabel: 'Buscar',
            enableSearchFilter: true,
            badgeShowLimit: 3,
            searchBy: ['glosa'],
            searchPlaceholderText: 'Buscar'
          };
          this.buscar();
        }
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
      });
  }

  buscar() {
    this.msj = '';
    this.rows = [];
    this.listaCnsEmp = [];
    if (this.selected.length > 0) {
      $('#loading').css('display', 'block');
      for (let i = 0; i < this.selected.length; i++) {
        this.listaCnsEmp[i] = {
          cnsEmp: this.selected[i].cnsEmp
        };
      }

      this.rendicionService.getRendicion(this.rendicionSelect).subscribe((response: any) => {
          this.rows = response.rows;
          this.divList = true;
          this.culo = response.rows[1].fechaUltEnvio
        }, error => {
          console.log('Error: ' + JSON.stringify(error));
        });


    } else {
      this.divList = false;
    }
  }

  pichuladeperrorush() {
    this.buscar();
  }


  exportarXLSX() {
    const ws = XLSX.utils.aoa_to_sheet([
      ['BANCO CONSORCIO'],
      ['CONSULTA DE OPERACIONES'],
      [],
    ]);
    XLSX.utils.sheet_add_json(ws, this.rows, {origin: 'B5'});

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Operaciones');

    ws['!cols'] = [{width: 18}, {width: 18}, {width: 18}, {width: 18}, {width: 18},
      {width: 25}, {width: 25}, {width: 18}, {width: 18}, {width: 18}, {width: 18}];

    const workbook: XLSX.WorkBook = {Sheets: {'Operaciones': ws}, SheetNames: ['Operaciones']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true});

    const d = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const fecha = d.getDate() + '_' + months[d.getMonth()] + '_' + d.getFullYear();
    this.saveAsExcelFile(excelBuffer, 'Operaciones' + fecha);


    this.buscar();
    swal('Operaciones', 'Ha sido correcta la exportación de operaciones :', 'success');
    $('#loading').css('display', 'none');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }


  onSelect() {
    this.buscar();
  }

  totalExportar() {
    swal({
      title: 'Rendición de CNS',
      text: 'Total de resgitros a exportar: ' + this.rows.length + '.',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Generar archivo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.exportar();
      }
    });
    return false;
  }

  exportar() {
    if (this.rows.length > 0) {
      $('#loading').css('display', 'block');

      this.rendicionService.insertRendicion(this.rendicionInsert).subscribe((response: any) => {
          if (response.code === '0') {
            $('#loading').css('display', 'none');
            swal('Rendición', 'Archivo generado y enviado a casilla FTP.', 'success');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/pages/otros/rendicion']));
          } else {
            this.progressBar();
            $('#loading').css('display', 'none');
            swal('Rendición', response.description, 'error');
          }
        }, error => {
          console.log('Error: ' + JSON.stringify(error));
          $('#loading').css('display', 'none');
        });
    }
  }

  writeToFile(contentToFile: string) {
    const textFileAsBlob = new Blob([contentToFile], {type: 'text/plain'});
    const d = new Date();
    const fecha = d.getFullYear().toString() + (d.getMonth() + 1).toString() + d.getDate().toString();

    const fileNameToSaveAs = 'Rendicion_CNS_' + fecha + '.txt';
    const downloadLink = document.createElement('a');
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Descargar archivo Rendición';

    window.URL = window.URL || (<any>window).webkitURL;

    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = this.destroyClickedElement;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();

    swal('Rendición', 'El archivo ' + fileNameToSaveAs + ' se exportó con éxito en la carpeta Descargas.', 'success');
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate(['/pages/otros/rendicion']));
    $('#loading').css('display', 'none');
  }

  destroyClickedElement(event) {
    document.body.removeChild(event.target);
  }

  progressBar() {
    this.service.progressBar();
  }

}
