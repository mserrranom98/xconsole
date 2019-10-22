import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {OperacionesService} from '../../../../../pages-services/serv-general/operaciones.service';

@Component({
  selector: 'app-detalle-operaciones',
  templateUrl: './detalle-operaciones.component.html'
})
export class DetalleOperacionesComponent implements OnInit {

  glosa = '';
  operaciones = [];

  constructor(
    private operacionesService: OperacionesService,
    public dialogRef: MatDialogRef<DetalleOperacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.glosa = data.instrumentoGlosa;

    this.getOperacionesDetalle(data);
  }

  ngOnInit() {
  }

  getOperacionesDetalle(data) {
    this.operacionesService.getOperacionesIII(data).subscribe((response: any) => {
        if (response.rowCount !== '0') {
          this.operaciones = response.rows;
        }
      }
    );
  }

  /** (MS) - Cerrar el componente tipo dialogo */
  cerrar() {
    this.dialogRef.close();
  }

}
