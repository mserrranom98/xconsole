import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { RestricSelect, RestricEmpresas, RestricSucursales, RestricInstrumentos, RestricInsert, RestricDelete } from '../../../pages-models/model-general';
import { RestriccionesService } from '../../../pages-services/serv-general/restricciones.service';

@Component({
  selector: 'app-restricciones',
  templateUrl: './restricciones.component.html',
  styleUrls: ['./restricciones.component.scss']
})
export class RestriccionesComponent implements OnInit {
  restricSelect: RestricSelect;
  restricEmpresas: RestricEmpresas;
  restricSucursales: RestricSucursales;
  restricInstrumentos: RestricInstrumentos;
  restricInsert: RestricInsert;
  restricDelete: RestricDelete;
  divAddRestriccion = false;
  disabled1 = true;
  disabled2 = true;
  disabled3 = true;
  disabled4 = true;
  divEnabled2 = false;
  divEnabled4 = false;
  concep1 = '';
  concep2 = '';
  listCod1 = '';
  listCod2 = '';
  listCod3 = '';
  listCod4 = '';
  listCodigo1: any[];
  listCodigo2: any[];
  listCodigo3: any[];
  listCodigo4: any[];
  msjAddRestric = '';
  msj = '';
  msjModal = '';
  closeResult: string;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any[] = [];
  divList = false;

  constructor(
    private restriccionesService: RestriccionesService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.restricSelect = new RestricSelect('', '');
    this.restricEmpresas = new RestricEmpresas('', '');
    this.restricSucursales = new RestricSucursales('', '', '');
    this.restricInstrumentos = new RestricInstrumentos('', '', '');
    this.restricInsert = new RestricInsert('', '', '', '', '', '');
    this.restricDelete = new RestricDelete('', '', '');
  }

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    this.restriccionesService.getRestricciones(this.restricSelect).subscribe(
      (response: any) => {
        if (response.rowCount > 0) {
          this.divList = true;
          for (let i = 0; i < response.rowCount; i++) {
            let con1 = '';
            let con2 = '';
            if (response.rows[i].concepto1.trim() === 'REX') {
              con1 = 'Empresa REX';
            }
            if (response.rows[i].concepto1.trim() === 'SUCUR') {
              con1 = 'Sucursal';
            }
            if (response.rows[i].concepto1.trim() === 'EPS') {
              con1 = 'Empresa EPS';
            }
            if (response.rows[i].concepto1.trim() === 'INSTRU') {
              con1 = 'Instrumento';
            }
            if (response.rows[i].concepto2.trim() === 'REX') {
              con2 = 'Empresa REX';
            }
            if (response.rows[i].concepto2.trim() === 'SUCUR') {
              con2 = 'Sucursal';
            }
            if (response.rows[i].concepto2.trim() === 'EPS') {
              con2 = 'Empresa EPS';
            }
            if (response.rows[i].concepto2.trim() === 'INSTRU') {
              con2 = 'Instrumento';
            }
            const r: Object = {
              regla: response.rows[i].regla,
              concepto1: con1,
              codigo1Glosa: response.rows[i].codigo1Glosa,
              concepto2: con2,
              codigo2Glosa: response.rows[i].codigo2Glosa
            };
            this.rows[i] = r;
          }
          $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
        } else {
          this.msj = 'No hay resultados.';
          $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    )
  }

  nuevaRestriccion() {
    this.divAddRestriccion = true;
  }

  selectCodigo1() {
    this.listCodigo1 = [];
    this.listCodigo2 = [];
    this.listCod1 = '';
    this.listCod2 = '';
    this.divEnabled2 = false;
    this.disabled1 = true;
    this.disabled2 = true;
    if (this.concep1 === 'EPS') {
      this.restriccionesService.getRestricEmpresas(this.restricEmpresas).subscribe(
        (response: any) => {
          if (response.rowCount > 0) {
            let count = 0;
            for (let i = 0; i < response.rowCount; i++) {
              if (response.rows[i].concepto.trim() === 'EPS') {
                const emp: Object = {
                  codigo: response.rows[i].codigo,
                  glosa: response.rows[i].glosa
                };
                this.listCodigo1[count] = emp;
                count++;
              }
            }
            this.listCod1 = this.listCodigo1[0].codigo;
            this.disabled1 = false;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep1 === 'REX') {
      this.restriccionesService.getRestricEmpresas(this.restricEmpresas).subscribe(
        (response: any) => {
          if (response.rowCount > 0) {
            let count = 0;
            for (let i = 0; i < response.rowCount; i++) {
              if (response.rows[i].concepto.trim() === 'REX') {
                const emp2: Object = {
                  codigo: response.rows[i].codigo,
                  glosa: response.rows[i].glosa
                }
                this.listCodigo1[count] = emp2;
                count++;
              }
            }
            this.listCod1 = this.listCodigo1[0].codigo;
            this.disabled1 = false;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep1 === 'INSTRU') {
      this.restriccionesService.getRestricEmpresas(this.restricEmpresas).subscribe(
        (response: any) => {
          if (response.rowCount > 0) {
            let count = 0;
            for (let i = 0; i < response.rowCount; i++) {
              if (response.rows[i].concepto.trim() === 'EPS') {
                const emp: Object = {
                  codigo: response.rows[i].codigo,
                  glosa: response.rows[i].glosa
                }
                this.listCodigo1[count] = emp;
                count++;
              }
            }
            this.listCod1 = this.listCodigo1[0].codigo;
            this.restricInstrumentos.eps = this.listCod1;
            this.restriccionesService.getRestricInstrumentos(this.restricInstrumentos).subscribe(
              (result: any) => {
                if (result.rowCount > 0) {
                  for (let i = 0; i < result.rowCount; i++) {
                    const ins: Object = {
                      codigo: result.rows[i].codigo,
                      glosa: result.rows[i].glosa
                    }
                    this.listCodigo2[i] = ins;
                  }
                  this.listCod2 = this.listCodigo2[0].codigo;
                  this.disabled1 = false;
                  this.disabled2 = false;
                  this.divEnabled2 = true;
                }
              },
              error => {
                console.log('Error: ' + JSON.stringify(error));
              }
            )
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep1 === 'SUCUR') {
      this.restriccionesService.getRestricEmpresas(this.restricEmpresas).subscribe(
        (response: any) => {
          if (response.rowCount > 0) {
            let count = 0;
            for (let i = 0; i < response.rowCount; i++) {
              if (response.rows[i].concepto.trim() === 'REX') {
                const emp: Object = {
                  codigo: response.rows[i].codigo,
                  glosa: response.rows[i].glosa
                };
                this.listCodigo1[count] = emp;
                count++;
              }
            }
            this.listCod1 = this.listCodigo1[0].codigo;
            this.restricSucursales.rex = this.listCod1;
            this.restriccionesService.getRestricSucursales(this.restricSucursales).subscribe(
              (result: any) => {
                if (result.rowCount > 0) {
                  for (let i = 0; i < result.rowCount; i++) {
                    const suc: Object = {
                      codigo: result.rows[i].codigo,
                      glosa: result.rows[i].glosa
                    };
                    this.listCodigo2[i] = suc;
                  }
                  this.listCod2 = this.listCodigo2[0].codigo;
                  this.disabled1 = false;
                  this.disabled2 = false;
                  this.divEnabled2 = true;
                }
              },
              error => {
                console.log('Error: ' + JSON.stringify(error));
              }
            )
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep1 === '') {
      this.msjAddRestric = 'Debe indicar el concepto 1.';
    }
  }

  selectCodigo2() {
    this.listCodigo2 = [];
    this.listCod2 = '';
    this.disabled2 = true;
    if (this.concep1 === 'INSTRU') {
      this.restricInstrumentos.eps = this.listCod1;
      this.restriccionesService.getRestricInstrumentos(this.restricInstrumentos).subscribe(
        (response: any) => {
          if (response.rowCount > 0) {
            for (let i = 0; i < response.rowCount; i++) {
              const ins: Object = {
                codigo: response.rows[i].codigo,
                glosa: response.rows[i].glosa
              }
              this.listCodigo2[i] = ins;
            }
            this.listCod2 = this.listCodigo2[0].codigo;
            this.disabled2 = false;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep1 === 'SUCUR') {
      this.restricSucursales.rex = this.listCod1;
      this.restriccionesService.getRestricSucursales(this.restricSucursales).subscribe(
        (response:any) => {
          if (response.rowCount > 0) {
            for (let i = 0; i < response.rowCount; i++) {
              let suc: Object = {
                codigo: response.rows[i].codigo,
                glosa: response.rows[i].glosa
              }
              this.listCodigo2[i] = suc;
            }
            this.listCod2 = this.listCodigo2[0].codigo;
            this.disabled2 = false;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep1 === '') {
      this.msjAddRestric = 'Debe indicar el concepto 1.';
    }
  }

  selectCodigo3() {
    this.listCodigo3 = [];
    this.listCodigo4 = [];
    this.listCod3 = '';
    this.listCod4 = '';
    this.divEnabled4 = false;
    this.disabled3 = true;
    this.disabled4 = true;
    if (this.concep2 === 'EPS') {
      this.restriccionesService.getRestricEmpresas(this.restricEmpresas).subscribe(
        (response:any) => {
          if (response.rowCount > 0) {
            let count = 0;
            for (let i = 0; i < response.rowCount; i++) {
              if (response.rows[i].concepto.trim() === 'EPS') {
                let emp: Object = {
                  codigo: response.rows[i].codigo,
                  glosa: response.rows[i].glosa
                }
                this.listCodigo3[count] = emp;
                count++;
              }
            }
            this.listCod3 = this.listCodigo3[0].codigo;
            this.disabled3 = false;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep2 === 'REX') {
      this.restriccionesService.getRestricEmpresas(this.restricEmpresas).subscribe(
        (response:any) => {
          if (response.rowCount > 0) {
            let count = 0;
            for (let i = 0; i < response.rowCount; i++) {
              if (response.rows[i].concepto.trim() === 'REX') {
                let emp: Object = {
                  codigo: response.rows[i].codigo,
                  glosa: response.rows[i].glosa
                }
                this.listCodigo3[count] = emp;
                count++;
              }
            }
            this.listCod3 = this.listCodigo3[0].codigo;
            this.disabled3 = false;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep2 === 'INSTRU') {
      this.restriccionesService.getRestricEmpresas(this.restricEmpresas).subscribe(
        (response:any) => {
          if (response.rowCount > 0) {
            let count = 0;
            for (let i = 0; i < response.rowCount; i++) {
              if (response.rows[i].concepto.trim() === 'EPS') {
                let emp: Object = {
                  codigo: response.rows[i].codigo,
                  glosa: response.rows[i].glosa
                }
                this.listCodigo3[count] = emp;
                count++;
              }
            }
            this.listCod3 = this.listCodigo3[0].codigo;
            this.restricInstrumentos.eps = this.listCod3;
            this.restriccionesService.getRestricInstrumentos(this.restricInstrumentos).subscribe(
              (result:any) => {
                if (result.rowCount > 0) {
                  for (let i = 0; i < result.rowCount; i++) {
                    let ins: Object = {
                      codigo: result.rows[i].codigo,
                      glosa: result.rows[i].glosa
                    }
                    this.listCodigo4[i] = ins;
                  }
                  this.listCod4 = this.listCodigo4[0].codigo;
                  this.disabled3 = false;
                  this.disabled4 = false;
                  this.divEnabled4 = true;
                }
              },
              error => {
                console.log('Error: ' + JSON.stringify(error));
              }
            )
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep2 === 'SUCUR') {
      this.restriccionesService.getRestricEmpresas(this.restricEmpresas).subscribe(
        (response:any) => {
          if (response.rowCount > 0) {
            let count = 0;
            for (let i = 0; i < response.rowCount; i++) {
              if (response.rows[i].concepto.trim() === 'REX') {
                let emp: Object = {
                  codigo: response.rows[i].codigo,
                  glosa: response.rows[i].glosa
                }
                this.listCodigo3[count] = emp;
                count++;
              }
            }
            this.listCod3 = this.listCodigo3[0].codigo;
            this.restricSucursales.rex = this.listCod3;
            this.restriccionesService.getRestricSucursales(this.restricSucursales).subscribe(
              (result:any) => {
                if (result.rowCount > 0) {
                  for (let i = 0; i < result.rowCount; i++) {
                    let suc: Object = {
                      codigo: result.rows[i].codigo,
                      glosa: result.rows[i].glosa
                    }
                    this.listCodigo4[i] = suc;
                  }
                  this.listCod4 = this.listCodigo4[0].codigo;
                  this.disabled3 = false;
                  this.disabled4 = false;
                  this.divEnabled4 = true;
                }
              },
              error => {
                console.log('Error: ' + JSON.stringify(error));
              }
            )
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }

  selectCodigo4() {
    this.listCodigo4 = [];
    this.listCod4 = '';
    this.disabled4 = true;
    if (this.concep2 === 'INSTRU') {
      this.restricInstrumentos.eps = this.listCod3;
      this.restriccionesService.getRestricInstrumentos(this.restricInstrumentos).subscribe(
        (response:any) => {
          if (response.rowCount > 0) {
            for (let i = 0; i < response.rowCount; i++) {
              let ins: Object = {
                codigo: response.rows[i].codigo,
                glosa: response.rows[i].glosa
              }
              this.listCodigo4[i] = ins;
            }
            this.listCod4 = this.listCodigo4[0].codigo;
            this.disabled4 = false;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
    if (this.concep2 === 'SUCUR') {
      this.restricSucursales.rex = this.listCod3;
      this.restriccionesService.getRestricSucursales(this.restricSucursales).subscribe(
        (response:any) => {
          if (response.rowCount > 0) {
            for (let i = 0; i < response.rowCount; i++) {
              let suc: Object = {
                codigo: response.rows[i].codigo,
                glosa: response.rows[i].glosa
              }
              this.listCodigo4[i] = suc;
            }
            this.listCod4 = this.listCodigo4[0].codigo;
            this.disabled4 = false;
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }

  addRestriccion() {
    if (this.validar()) {
      if (this.concep1 === 'INSTRU') {
        if (this.listCod2 === '') {
          // tslint:disable-next-line:max-line-length
          this.msjAddRestric = 'No puede guardar la restricción porque no existen instrumentos para la EPS seleccionada, en el concepto 1. Por favor, contacte con el administrador de la aplicación.';
          return false;
        } else {
          this.restricInsert.codigo1 = this.listCod1 + '.' + this.listCod2;
        }
      }
      if (this.concep1 === 'SUCUR') {
        if (this.listCod2 === '') {
          // tslint:disable-next-line:max-line-length
          this.msjAddRestric = 'No puede guardar la restricción porque no existen sucursales para la Empresa (REX) seleccionada, en el concepto 1. Por favor, contacte con el administrador de la aplicación.';
          return false;
        } else {
          this.restricInsert.codigo1 = this.listCod1 + '.' + this.listCod2;
        }
      }
      if (this.concep1 === 'EPS' || this.concep1 === 'REX') {
        this.restricInsert.codigo1 = this.listCod1;
      }
      if (this.concep2 === 'INSTRU') {
        if (this.listCod4 === '') {
          // tslint:disable-next-line:max-line-length
          this.msjAddRestric = 'No se puede guardar la restricción porque no existen instrumentos para la EPS seleccionada, en el concepto 2. Por favor, contacte con el administrador de la aplicación.';
          return false;
        } else {
          this.restricInsert.codigo2 = this.listCod3 + '.' + this.listCod4;
          this.insertRestriccion();
        }
      }
      if (this.concep2 === 'SUCUR') {
        if (this.listCod4 === '') {
          // tslint:disable-next-line:max-line-length
          this.msjAddRestric = 'No puede guardar la restricción porque no existen sucursales para la Empresa (REX) seleccionada, en el concepto 2. Por favor, contacte con el administrador de la aplicación.';
          return false;
        } else {
          this.restricInsert.codigo2 = this.listCod3 + '.' + this.listCod4;
          this.insertRestriccion();
        }
      }
      if (this.concep2 === 'EPS' || this.concep2 === 'REX') {
        this.restricInsert.codigo2 = this.listCod3;
        this.insertRestriccion();
      }
    }
  }

  insertRestriccion() {
    this.restriccionesService.insertRestriccion(this.restricInsert).subscribe(
      (response:any) => {
        if (response.code === '0') {
          swal('Restricciones', 'Registro guardado con éxito', 'success');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/general/restricciones/restricciones']));
        } else {
          swal('Restricciones', response.description, 'error');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  validar() {
    if (this.concep1 === '') {
      this.msjAddRestric = 'Debe indicar el concepto 1.';
      return false;
    }
    if (this.concep2 === '') {
      this.msjAddRestric = 'Debe indicar el concepto 2.';
      return false;
    }
    return true;
  }

  cancelAddRestriccion() {
    this.divAddRestriccion = false;
    this.concep1 = '';
    this.concep2 = '';
    this.listCodigo1 = [];
    this.listCodigo2 = [];
    this.listCodigo3 = [];
    this.listCodigo4 = [];
    this.listCod1 = '';
    this.listCod2 = '';
    this.listCod3 = '';
    this.listCod4 = '';
    this.disabled1 = true;
    this.disabled2 = true;
    this.disabled3 = true;
    this.disabled4 = true;
    this.divEnabled2 = false;
    this.divEnabled4 = false;
  }

  open(content, rowIndex) {
    this.restricDelete.regla = this.rows[rowIndex].regla;
    this.msjModal = '¿Está seguro que quiere borrar la restricción?';
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

  deleteRestriccion() {
    this.restriccionesService.deleteRestriccion(this.restricDelete).subscribe(
      (response:any) => {
        if (response.code === '0') {
          swal('Restricciones', 'Registro borrado con éxito', 'success');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/general/restricciones/restricciones']));
        } else {
          swal('Restricciones', response.description, 'error');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }
}
