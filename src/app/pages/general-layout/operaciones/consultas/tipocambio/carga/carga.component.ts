import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TipoCambioService } from '../tipocambio.service';
import { CargaMasivaTipoCambio, ListaMoneda } from '../tipocambio.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss']
})
export class CargaComponent implements OnInit {

  archivo: any;
  cargaMasiva: CargaMasivaTipoCambio;
  moneda :string;
  msj = '';
  glosar: any[];
  tipoMoneda: ListaMoneda;

  constructor(   
    private tipocambioService: TipoCambioService,
    public dialogRef: MatDialogRef<CargaComponent>,
    ) {
      this.cargaMasiva = new CargaMasivaTipoCambio('', '', '', '');
      this.tipoMoneda = new ListaMoneda('', '', '', '');
     }

  ngOnInit() {

    this.tipocambioService.getTipoMoneda(this.tipoMoneda).subscribe(
      (response: any) => {
        if (response.code === '6996') {
          swal('Tipo Cambio', response.description + '. Verifique Servidor Netswitch', 'error');
          $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
        } else {
          this.glosar = response.items;
          $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
        }
      }
    )

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

  getMoneda(a){

    this.moneda = a;
  }


  enviarArchivo() {
    this.cargaMasiva.archivo = this.archivo;
    this.cargaMasiva.moneda = this.moneda;
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

  cerrar() {
    this.dialogRef.close();
  }

}
