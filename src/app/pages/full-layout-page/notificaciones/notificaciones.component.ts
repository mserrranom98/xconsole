import { Component, OnInit, ViewChild } from '@angular/core';
import { NotiSelect, NotiPick, NotiDone } from '../../pages-models/model-global';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import swal from 'sweetalert2';
import { NotificacionService } from '../../pages-services/serv-reca/notificacion.service';

const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 1;

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styles: []
})
export class NotificacionesComponent implements OnInit {
  pdfSrc = '';
  not: NotiSelect;
  notiPick: NotiPick;
  notiDone: NotiDone;
  @ViewChild('table') table: any;
  listNoti = [];
  rows: any[] = [];
  columns = [];
  fechaNoti = '';
  usuarioNoti = '';
  requestName = '';
  requestObject = '';
  requestText = '';
  closeResult: string;
  data: any;
  cropperSettings: CropperSettings;
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  aut = false;
  pdf: ArrayBuffer;
  public pdfZoom: number = DEFAULT_ZOOM;

  constructor(
    public notificacionService: NotificacionService,
    private modalService: NgbModal
  ) {
    this.not = new NotiSelect('', '');
    this.notiPick = new NotiPick('', '', '');
    this.notiDone = new NotiDone('', '', '', '');
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.croppedWidth = 600;
    this.cropperSettings.croppedHeight = 250;
    this.cropperSettings.noFileInput = true;
    this.data = {};
    this.data.image = '';
    this.notiDone.granted = '0';
  }

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    this.listNoti = [];
    this.rows = [];
    this.notificacionService.getNoti(this.not).subscribe(
      (result:any) => {
        if (result.rowCount > 0) {
          this.listNoti = result.rows;
          this.rows = this.listNoti;
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      })
  }

  pick(rowIndex) {
    this.notiPick.id = this.rows[rowIndex].id;
    this.notificacionService.pickNoti(this.notiPick).subscribe(
      (result:any) => {
        if (result.code === '0') {
          this.requestName = result.requestName;
          this.requestObject = result.requestObject;
          this.requestText = result.requestText;

          const file = new Blob([result.requestObject], { type: 'application/pdf' });
          this.pdfSrc = URL.createObjectURL(file);
          // console.log(this.pdfSrc)
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      })

  }

  done(rowIndex) {
    console.log(JSON.stringify(this.rows[rowIndex].id));
  }

  open(content, rowIndex) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.usuarioNoti = this.rows[rowIndex].sender;
    this.fechaNoti = this.rows[rowIndex].settled;

    // tslint:disable-next-line:max-line-length
    this.fechaNoti = this.fechaNoti.substring(8, 10) + '-' + this.fechaNoti.substring(5, 7) + '-' + this.fechaNoti.substring(0, 4) + '  ' + this.fechaNoti.substring(11, 19);

    // this.pick(rowIndex);
    // tslint:disable-next-line:max-line-length
    const aaa = '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czppWD0naHR0cDovL25zLmFkb2JlLmNvbS9pWC8xLjAvJz4KPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JzZlNmM1M2NiLWM4MTYtMTFlOC0wMDAwLTIzM2MyODkwZTM4YycgeG1sbnM6cGRmPSdodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvJyBwZGY6UHJvZHVjZXI9J0J1bGx6aXAgUERGIFByaW50ZXIgLyB3d3cuYnVsbHppcC5jb20gLyBGcmVld2FyZSBFZGl0aW9uIFwobm90IHJlZ2lzdGVyZWRcKScvPgo8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nNmU2YzUzY2ItYzgxNi0xMWU4LTAwMDAtMjMzYzI4OTBlMzhjJyB4bWxuczp4YXA9J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8nIHhhcDpNb2RpZnlEYXRlPScyMDE4LTEwLTAxVDE3OjQ1OjI5LTAzOjAwJyB4YXA6Q3JlYXRlRGF0ZT0nMjAxOC0xMC0wMVQxNzo0NToyOS0wMzowMCc+PHhhcDpDcmVhdG9yVG9vbD5QU2NyaXB0NS5kbGwgVmVyc2lvbiA1LjIuMjwveGFwOkNyZWF0b3JUb29sPjwvcmRmOkRlc2NyaXB0aW9uPgo8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nNmU2YzUzY2ItYzgxNi0xMWU4LTAwMDAtMjMzYzI4OTBlMzhjJyB4bWxuczp4YXBNTT0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLycgeGFwTU06RG9jdW1lbnRJRD0nNmU2YzUzY2ItYzgxNi0xMWU4LTAwMDAtMjMzYzI4OTBlMzhjJy8+CjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSc2ZTZjNTNjYi1jODE2LTExZTgtMDAwMC0yMzNjMjg5MGUzOGMnIHhtbG5zOmRjPSdodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLycgZGM6Zm9ybWF0PSdhcHBsaWNhdGlvbi9wZGYnPjxkYzp0aXRsZT48cmRmOkFsdD48cmRmOmxpIHhtbDpsYW5nPSd4LWRlZmF1bHQnPigpPC9yZGY6bGk+PC9yZGY6QWx0PjwvZGM6dGl0bGU+PGRjOmNyZWF0b3I+PHJkZjpTZXE+PHJkZjpsaT5yYXJjZTwvcmRmOmxpPjwvcmRmOlNlcT48L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+CjwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0ndyc/PgplbmRzdHJlYW0KZW5kb2JqCjIgMCBvYmoKPDwvUHJvZHVjZXIoQnVsbHppcCBQREYgUHJpbnRlciAvIHd3dy5idWxsemlwLmNvbSAvIEZyZWV3YXJlIEVkaXRpb24gXChub3QgcmVnaXN0ZXJlZFwpKQovQ3JlYXRpb25EYXRlKEQ6MjAxODEwMDExNzQ1MjktMDMnMDAnKQovTW9kRGF0ZShEOjIwMTgxMDAxMTc0NTI5LTAzJzAwJykKL0F1dGhvcihyYXJjZSkKL1RpdGxlKCkKL0NyZWF0b3IoUFNjcmlwdDUuZGxsIFZlcnNpb24gNS4yLjIpPj5lbmRvYmoKeHJlZgowIDEyCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDM5OSAwMDAwMCBuIAowMDAwMDExMDg5IDAwMDAwIG4gCjAwMDAwMDAzMzAgMDAwMDAgbiAKMDAwMDAwMDE2NSAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAxNDcgMDAwMDAgbiAKMDAwMDAwMDQ4OSAwMDAwMCBuIAowMDAwMDAwNTg5IDAwMDAwIG4gCjAwMDAwMDA1MzAgMDAwMDAgbiAKMDAwMDAwMDU1OSAwMDAwMCBuIAowMDAwMDA5NjAyIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgMTIgL1Jvb3QgMSAwIFIgL0luZm8gMiAwIFIKL0lEIFs8RUUwNjQ2RTk0MDJFNURDMTg1OTQ3NUNFNUQwQzdCNDY+PEVFMDY0NkU5NDAyRTVEQzE4NTk0NzVDRTVEMEM3QjQ2Pl0KPj4Kc3RhcnR4cmVmCjExMzI4CiUlRU9GCg==';
    //this.pdf = this.base64ToArrayBuffer(aaa);
    /*const myBlob: Blob = new Blob([this.pdf], {type: 'application/pdf'});
    const fileURL = URL.createObjectURL(myBlob);
    window.open(fileURL);*/
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  guardar() {
    /*this.notificacionService.doneNoti(this.notiDone).subscribe(
      response => {
        if ( response.code === '0') {
          swal('Notificaciones', response.description, 'success');
        } else {
          swal('Notificaciones', response.description, 'error');
        }
      }
    )*/
  }

  private onChange() {
    if (this.aut === true) {
      this.notiDone.granted = '1';
    } else {
      this.notiDone.granted = '0';
    }
  }

  public zoomIn() {
    this.pdfZoom += ZOOM_STEP;
  }

  public zoomOut() {
    if (this.pdfZoom > DEFAULT_ZOOM) {
      this.pdfZoom -= ZOOM_STEP;
    }
  }
}
