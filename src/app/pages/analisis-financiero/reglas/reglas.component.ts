import {Component, OnInit, ViewChild} from '@angular/core';
import {ReglasService} from '../../../shared/services/reglas/reglas.service';
import swal from 'sweetalert2';
import {DxDataGridComponent} from 'devextreme-angular';
import {GruposService} from '../../../shared/services/grupos/grupos.service';
import {UtilsService} from '../../../shared/services/utils/utils.service';

@Component({
  selector: 'app-reglas',
  templateUrl: './reglas.component.html'
})
export class ReglasComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  reglas = [];
  mediosDePago = [];
  empresas = [];
  grupos = [];

  gruposSelect = '';

  contador = 0;
  noDataText = 'No hay datos que mostrar';

  constructor(
    private gruposService: GruposService,
    private reglasService: ReglasService,
    private utilsService: UtilsService,
  ) {
    this.getReglas();
    this.getMdp();
    this.getEmpresa();
    this.getGrupos();
  }

  ngOnInit() {
  }

  /** (MS) - Recupera los grupos
   * @method getGrupos Se conecta con el Servicio RSUMB */
  getGrupos() {
    this.gruposService.getGrupos('S').subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Regla UAF', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      } else {
        this.grupos = response.grupoMail;
        this.validarFunciones();
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Recupera los meidos de pago
   * @method getInstrumentos Se conecta con el Servicio RSUMB */
  getMdp() {
      this.utilsService.getInstrumentos().subscribe((response: any) => {
        if (response.code === '0') {
          this.mediosDePago = response.rows.filter((item) => item.tipo !== 'INGRES' && item.tipo !== 'EGRESO');
          this.mediosDePago.push({codigo: 'TICKET', tipo: 'PAGO', titulo: 'TICKET'});
          this.validarFunciones();
        } else {
          swal('Regla UAF', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
          $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
        }
      }, error => {
        console.log('Error: ' + JSON.stringify(error));
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      });
  }

  /** (MS) - Recupera las empresas
   * @method getEmpEps Se conecta con el Servicio RSUMB */
  getEmpresa() {
    this.utilsService.getEmpEps().subscribe((response: any) => {
      if (response.code === '0') {
        this.empresas = response.rows;
        this.validarFunciones();
      } else {
        swal('Regla UAF', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
      $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
    });
  }

  /** (MS) - Recupera las reglas segun el estado
   * @method getReglas Se conecta con el Servicio RSUMB */
  getReglas() {
    this.reglasService.getReglas().subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Regla UAF', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      } else {
        this.reglas = response.respuestaFinal;
        this.validarFunciones();
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
      $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
    });
  }

  /** Se configura como se mostrara la glosaGrupo en la columna de la tabla
   * @param cellInfo Es el valor original de la columna
   * @return value Es el valor de la columna convertido en String y separado por comas*/
  getGruposNames(cellInfo) {
    let value = '';
    let cont = 1;

    if (cellInfo.value) {
      for (const grupo of cellInfo.value) {
        if (cellInfo.value.length === cont) {
          value = value + grupo.glosaGrupo;
        } else {
          value = value + grupo.glosaGrupo + ', ';
          cont++;
        }
      }
    }

    return value;
  }

  /** (MS) - Remover regla
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method updateGrupo Se comunica con los servios de RSUMB */
  removeRegla(row) {
    this.reglasService.removeRegla(row.data.id).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Regla UAF', 'Registro Eliminado con Exito', 'success');
        this.getReglas();
      } else {
        swal('Regla UAF', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Agregar una regla nueva
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method addRegla Se comunica con los servios de RSUMB */
  addRegla(row) {
    this.reglasService.addRegla(this.setGrupo(row.data)[0]).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Regla UAF', 'Registro Creado con Exito', 'success');
        this.getReglas();
      } else {
        swal('Regla UAF', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** Ingresa los datos actuales y los ingresa en el modelo que se enviara al RSUMB
   * @return modelo que se enviara */
  setGrupo(grupo) {
    return [
      {
        codigo: grupo.codigo,
        desde: grupo.desde,
        hasta: grupo.hasta,
        grupoid: this.gruposSelect,
        codigoEMP: grupo.codigoEMP,
      }
    ];
  }

  /** Guarda en una variable los grupos seleccionados
   * @param event Es el valor rescatado del select */
  onTagBoxValueChanged(event) {
    this.gruposSelect = '';
    let cont = 1;

    for (const id of event.value) {
      if (event.value.length === cont) {
        this.gruposSelect = this.gruposSelect + id;
      } else {
        this.gruposSelect = this.gruposSelect + id + ',';
        cont++;
      }
    }
  }

  /** (MS) - Valida que todas las funciones de llamar valores finalizaron */
  validarFunciones() {
    if (this.contador === 3) {
      $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
    } else {
      ++this.contador;
    }
  }

  /** (MS) - Crear validacion para comprobar si ya existe la regla en dx-data-grid
   * @param e Contiene las funciones de validacion en dx-data-grid */
  validarRegla(e) {
    console.log(e);
    if (e.isValid) {
      if (this.reglas.filter((item) => (item.codigo === e.newData.codigo) &&
        (item.desde === e.newData.desde) &&
        (item.hasta === e.newData.hasta) &&
        (item.codigoEMP === e.newData.codigoEMP)).length > 0) {

        e.errorText = 'La regla que ingreso, ya existe';
        e.isValid = false;
      } else if (e.newData.desde > e.newData.hasta) {
        e.errorText = 'El monto hasta no debe ser menor al monto desde';
        e.isValid = false;
      }
    }
  }

  /** (MS) - Modifica los campos al ejecutar las funciones de agregar y editar en dx-data-grid
   * @param e Contiene las funciones de campos en dx-data-grid */
  onEditorPreparing(e) {
    if (e.row.inserted && e.dataField === 'estado') {
      e.editorOptions.value = 'S';
      e.editorOptions.disabled = true;
    }
  }

}
