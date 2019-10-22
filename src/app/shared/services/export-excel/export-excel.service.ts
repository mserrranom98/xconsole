import {Injectable} from '@angular/core';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = '.xlsx';

  constructor() {
  }

  /** (MS) - Convierte una lista en un archivo excel
   * @param Contiene los datos para el excel
   * @name Contiene el nombre con el cual se generara el archivo
   * @method Se ejecuta el metodo saveAsExcelFile*/
  exportarXLSX(data, name) {
    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_json(ws, data, {origin: 'A1'});

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Voucher');

    ws['!cols'] = [{width: 18}, {width: 18}, {width: 18}, {width: 18}, {width: 18},
      {width: 25}, {width: 25}, {width: 18}, {width: 18}, {width: 18}, {width: 18}];

    const workbook: XLSX.WorkBook = {Sheets: {'Voucher': ws}, SheetNames: ['Voucher']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true});

    this.saveAsExcelFile(excelBuffer, name);

    swal('Operaciones', 'Ha sido correcta la exportación de operaciones :', 'success');
    $('#loading').css('display', 'none');
  }

  /** (MS) - Guarda el archivo excel en el dispositivo
   * @param buffer Archivo con su contenido
   * @param fileName Nombre del archivo*/
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: this.EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + this.EXCEL_EXTENSION);
  }
}
