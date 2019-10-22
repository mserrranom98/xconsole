import {Component, OnInit, ViewChild} from '@angular/core';
import {GruposService} from '../../../shared/services/grupos/grupos.service';
import swal from 'sweetalert2';
import {IntegrantesService} from '../../../shared/services/integrantes/integrantes.service';
import {DxDataGridComponent} from 'devextreme-angular';
import {IntermediaGIService} from '../../../shared/services/tablas-intermedias/intermedia-gi.service';

@Component({
  selector: 'app-grupo-correo',
  templateUrl: './grupo-correo.component.html'
})
export class GrupoCorreoComponent implements OnInit {

  @ViewChild('integranteTable') integranteTable: DxDataGridComponent;

  gruposIntegrantes = [];
  integrantes = [];
  filterIntegrantes = [];
  grupos = [];

  estadoSelect = 'S';

  viewGruposIntegrantes = true;
  viewGrupos = false;

  estados = [
    {
      id: 'S',
      estado: 'Activo (S)'
    },
    {
      id: 'N',
      estado: 'Inactivo (N)'
    },
  ];
  noDataText = 'No hay datos que mostrar';

  constructor(
    private gruposService: GruposService,
    private integrantesService: IntegrantesService,
    private intermediaService: IntermediaGIService
  ) {
  }

  ngOnInit() {
    this.getGruposIntegrantes();
    this.getIntegrantes('S');
  }

  /** (MS) - Recupera los grupos y sus integrantes
   * @method getGruposIntegrantes Se conecta con el Servicio RSUMB */
  getGruposIntegrantes() {
    this.gruposService.getGruposIntegrantes().subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Grupo de Correo', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      } else {
        this.gruposIntegrantes = response.respuestaFinal;
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
      $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
    });
  }

  /** (MS) - Recupera los grupos y sus integrantes
   * @method getGruposIntegrantes Se conecta con el Servicio RSUMB */
  getGrupos(estado) {
    this.gruposService.getGrupos(estado).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Grupo de Correo', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      } else {
        this.grupos = response.grupoMail;
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
      $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
    });
  }

  /** (MS) - Recupera los integrantes segun el estado
   * @param activo Contiene el estado por el cual se realizara la busqueda
   * @method getIntegrantes Se conecta con el Servicio RSUMB */
  getIntegrantes(activo) {
    this.integrantesService.getIntegrantes(activo).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Grupos de Correo', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      } else {
        this.integrantes = response.grupoMailIntegrantes;
        this.filterIntegrantes = response.grupoMailIntegrantes;
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
      $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
    });
  }

  /** (MS) - Modificar grupo
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method updateGrupo Se comunica con los servios de RSUMB */
  editarGrupo(row) {
    this.gruposService.updateGrupo(row.data).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Grupo de Correo', 'Registro Editado con Exito', 'success');
        this.getGruposIntegrantes();
        this.getGrupos('N');
      } else {
        swal('Grupo de Correo', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Agregar un grupo nuevo
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method addGrupo Se comunica con los servios de RSUMB */
  addGrupo(row) {
    this.gruposService.addGrupo(row.data).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Grupo de Correo', 'Registro Creado con Exito', 'success');
        this.getGruposIntegrantes();
        this.getGrupos('N');
      } else {
        swal('Grupo de Correo', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Crear validacion para comprobar si ya existe el correo en la variable correo al agregar un
   * nuevo grupo en dx-data-grid
   * @param e Contiene las funciones de validacion en dx-data-grid */
  validarGrupo(e) {
    if (e.isValid && this.gruposIntegrantes.filter((item) => item.correoGrupo === e.newData.correoGrupo).length > 0) {
      e.isValid = false;
      e.errorText = 'El correo que ingreso, ya existe';
    }
  }

  /** (MS) - Agregar un nuevo integrante al grupo
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method addIntermedia Se comunica con los servios de RSUMB
   * @method getGruposIntegrantes Vuelve a llamar a todos los grupos y sus integrantes */
  addIntegrante(row, idGrupo) {
    const integrante = this.integrantes.filter((item) => item.correoIntg === row.data.correoIntg);
    const intermedia = {
      idIntg: integrante[0].idIntg,
      idGrupo: idGrupo,
      userName: '',
      peticion: ''
    };
    this.intermediaService.addIntermedia(intermedia).subscribe((response: any) => {
      console.log(response);
      if (response.code === '0') {
        swal('Asociacion de Grupo e Integrante', 'Registro Creado con Exito', 'success');
        this.getGruposIntegrantes();
      } else {
        swal('Asociacion de Grupo e Integrante', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Elimina asociacion entre grupo e integrante
   * @param row Contiene los datos y funciones de la fila en dx-data-grid
   * @method removeIntermedia Se comunica con los servios de RSUMB
   * @method getGruposIntegrantes Vuelve a llamar a todos los grupos y sus integrantes */
  removeIntegrante(row, idGrupo) {
    const integrante = this.integrantes.filter((item) => item.correoIntg === row.data.correoIntg);
    const intermedia = {
      idIntg: integrante[0].idIntg,
      idGrupo: idGrupo,
      userName: '',
      peticion: ''
    };
    this.intermediaService.removeIntermedia(intermedia).subscribe((response: any) => {
      if (response.code === '0') {
        swal('Asociacion a grupo', 'Registro Creado con Exito', 'success');
        this.getGruposIntegrantes();
      } else {
        swal('Asociacion a grupo', response.description + '. Verifique Información', 'error');
      }
    }, error => {
      console.log('Error: ' + JSON.stringify(error));
    });
  }

  /** (MS) - Crear validacion para comprobar si ya existe el correo en la variable grupo al agregar un
   * nuevo integrante al grupo en dx-data-grid
   * @param e Contiene las funciones de validacion en dx-data-grid */
  validarIntegrante(e, integrantes) {
    console.log(integrantes);
    if (e.isValid && integrantes.filter((item) => item.correoIntg === e.newData.correoIntg).length > 0) {
      e.isValid = false;
      e.errorText = 'El integrante que ingreso, ya existe en el grupo';
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

  /** Mostrar y buscar la tabla de grupos segun la seleccion del estado
   * @param estado Es el estado que recibe del select
   * @method getGruposIntegrantes
   * @method getGrupos */
  changeEstado(estado) {
    console.log(estado);
    if (estado !== this.estadoSelect) {
      this.estadoSelect = estado;
      if (estado === 'S') {
        this.getGruposIntegrantes();
        this.viewGruposIntegrantes = true;
        this.viewGrupos = false;
      } else {
        this.getGrupos('N');
        this.viewGruposIntegrantes = false;
        this.viewGrupos = true;
      }
    }
  }

  /** (MS) - Mostrar los integrantes cuando se seleccione un grupo
   * @param e Evento que ocurre al seleccionar un grupo */
  selectionChanged(e) {
    e.component.collapseAll(-1);
    e.component.expandRow(e.currentSelectedRowKeys[0]);
  }

  /** (MS) - Modifica los campos al ejecutar las funciones de agregar y editar en dx-data-grid
   * @param e Contiene las funciones de campos en dx-data-grid */
  onEditorPreparingI(e) {
    if (e.row.inserted && e.dataField === 'nombre') {
      e.editorOptions.disabled = true;
      e.editorOptions.visible = false;
    }
  }

}
