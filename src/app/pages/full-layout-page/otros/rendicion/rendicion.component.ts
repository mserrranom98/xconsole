import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RendicionSelect, RendicionInsert } from '../../../pages-models/model-global';
import { ListasItems } from '../../../pages-models/model-emp-serv-rec';
import { RendicionService } from '../../../pages-services/serv-reca/rendicion.service';
import { ListasService } from '../../../pages-services/serv-emp-serv-rec/listas.services';
import { NGXToastrService } from './toastr.service';
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
  culo = "";

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
    this.selected = [];
    this.itemList = [];
    this.listaItems.lista = 'CNSREN';
    this.listasService.getListasDet(this.listaItems).subscribe(
      (response:any) => {
        if (response.items.length > 0) {
          for (let i = 0; i < response.items.length; i++) {
            let cnsEmp: Object = {
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
          }
          this.buscar();
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    );
  }

  buscar() {
    this.msj = '';
    this.rows = [];
    this.listaCnsEmp = [];
    let codigo=0;  
    if (this.selected.length > 0) {
      $('#loading').css('display', 'block');
      for (let i = 0; i < this.selected.length; i++) {
        let cnse: Object = {
          cnsEmp: this.selected[i].cnsEmp
        }
        this.listaCnsEmp[i] = cnse;
      }
      
      //console.log(JSON.stringify(this.rendicionSelect));
      // this.rendicionService.getRendicion(this.rendicionSelect).subscribe(
      //   (response:any) => {
      //     codigo = parseInt(response.code);          
      //     if(codigo !== 0 ){         
      //       swal('Rendicion','Disculpe las molestias contactese con El Administrador :\n' + response.description , 'error');
      //       $('#loading').css('display', 'none');
      //    }else{
      //     if (response.rowCount > 0) {
      //       //console.log(JSON.stringify(response));
      //       this.divList = true; 
      //       for (let i = 0; i < response.rowCount; i++) {
      //         let reg: Object = {
      //           sucursal: response.rows[i].sucursal,
      //           cod_sucursal: response.rows[i].cod_sucursal,
      //           fecha: response.rows[i].fecha,
      //           cnsEmp: response.rows[i].cnsEmp,
      //           cnsEmpGlosa: response.rows[i].cnsEmpGlosa,
      //           identi: response.rows[i].identi,
      //           monto: response.rows[i].monto,
      //           pago: response.rows[i].pago,
      //           pagoGlosa: response.rows[i].pagoGlosa,
      //           segGlosa: response.rows[i].cnsseg_glosa
      //         }
      //         this.dataT[i] = reg;
      //       }
      //       this.rows = this.dataT;
      //       $('#loading').css('display', 'none');
      //     } else {
      //       this.msj = 'No hay transacciones disponibles para enviar';
      //       this.divList = false;
      //       $('#loading').css('display', 'none');
      //     }
      //    }
         
      //   },
      //   error => {
      //     console.log('Error: ' + JSON.stringify(error));
      //     $('#loading').css('display', 'none');
      //   }
      // );


     this.rendicionService.getRendicion(this.rendicionSelect).subscribe(
        (response:any) => {
          this.rows = response.rows;
          //console.log(this.rows);
          this.divList=true;
          this.culo = response.rows[1].fechaUltEnvio
         // console.log(this.culo );
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )







    } else {
      this.divList = false;
    }
  }

  pichuladeperrorush(){
    this.buscar();
  }



exportarXLSX(){
  
          //Comienzo de exportación web excel
          const ws = XLSX.utils.aoa_to_sheet([
            ['BANCO CONSORCIO'],
            ['CONSULTA DE OPERACIONES'],
            [],
          ]);
                                        //Dato a pasar    //Donde empieza a poner la tabla
          XLSX.utils.sheet_add_json(ws, this.rows, { origin: 'B5' });

          //Donde crea el libro
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Operaciones');
      
          //Tamaño de las columnas
          const wscols = [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 },
          { width: 25 }, { width: 25 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }];
          ws['!cols'] = wscols;
      
          //no se para que sirve
          const workbook: XLSX.WorkBook = { Sheets: { 'Operaciones': ws }, SheetNames: ['Operaciones'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true });
      
          //aqui consigue la fecha en formato para dar el nombre
          const d = new Date();
          const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          const fecha = d.getDate() + '_' + months[d.getMonth()] + '_' + d.getFullYear();
      //Manda  a guardar con el nombre al final
          this.saveAsExcelFile(excelBuffer, 'Operaciones' + fecha);
          
          
          this.buscar();        
          swal('Operaciones','Ha sido correcta la exportación de operaciones :' , 'success');
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
    })

    return false;
  }

  exportar() {
    if (this.rows.length > 0) {
      $('#loading').css('display', 'block');
      
      this.rendicionService.insertRendicion(this.rendicionInsert).subscribe(        
        (response:any) => {          
          if (response.code === '0') {
            $('#loading').css('display', 'none');
            swal('Rendición', "Archivo generado y enviado a casilla FTP.", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(['/pages/otros/rendicion']));           
          } else {    
            this.progressBar();       
            $('#loading').css('display', 'none');
            swal('Rendición', response.description, 'error');
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
          $('#loading').css('display', 'none');
        }
      );
    }
  }

  writeToFile(contentToFile: string) {
    //  create a new Blob (html5 magic) that conatins the data from your form feild
    var textFileAsBlob = new Blob([contentToFile], { type: 'text/plain' });
    // Fecha para nombre de archivo
    const d = new Date();
    const fecha = d.getFullYear().toString() + (d.getMonth() + 1).toString() + d.getDate().toString();

    // Specify the name of the file to be saved
    var fileNameToSaveAs = 'Rendicion_CNS_' + fecha + '.txt';
    // create a link for our script to 'click'
    var downloadLink = document.createElement('a');
    //  supply the name of the file (from the var above).
    // you could create the name here but using a var
    // allows more flexability later.
    downloadLink.download = fileNameToSaveAs;
    // provide text for the link. This will be hidden so you
    // can actually use anything you want.
    downloadLink.innerHTML = 'Descargar archivo Rendición';

    // allow our code to work in webkit & Gecko based browsers
    // without the need for a if / else block.
    window.URL = window.URL || (<any>window).webkitURL;

    // Create the link Object.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    // when link is clicked call a function to remove it from
    // the DOM in case user wants to save a second file.
    downloadLink.onclick = this.destroyClickedElement;
    // make sure the link is hidden.
    downloadLink.style.display = 'none';
    // add the link to the DOM
    document.body.appendChild(downloadLink);

    // click the new link
    downloadLink.click();

    swal('Rendición', 'El archivo ' + fileNameToSaveAs + ' se exportó con éxito en la carpeta Descargas.', 'success');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/pages/otros/rendicion']));
    $('#loading').css('display', 'none');
  }

  destroyClickedElement(event) {
    // remove the link from the DOM
    document.body.removeChild(event.target);
  }

  progressBar() {
    this.service.progressBar();
}

}
