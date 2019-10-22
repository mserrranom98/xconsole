import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html'
})

export class FullLayoutComponent implements OnInit {
  src: string;
  image: string;
  message = '';


  constructor(
    private router: Router
  ) {
    this.src = '';
    this.image = '';
  }

  ngOnInit() {
    /*if (VARGLOBAL.user === 'coronapin') {
        this.image = 'assets/img/sidebar-bg/02.jpg';
        this.src = 'assets/img/logo-corona_mi_solucion.png';
        $('#imgFondo').attr('data-image', this.image);

    } else {
        this.src = '';
        this.image = 'assets/img/sidebar-bg/01.jpg';
        $('#imgFondo').attr('data-image', this.image);
    }*/

  }

  filterMessage(dataFilter: string) {
    this.message = dataFilter;

    switch (dataFilter) {
      case 'Operaciones':
        $('.page-filter').css({ 'display': 'block' });
        break;
      case 'Turnos':
        $('.page-filter').css({ 'display': 'block' });
        break;
      case 'Journal':
        $('.page-filter').css({ 'display': 'block' });
        break;
      case 'Arqueo':
        $('.page-filter').css({ 'display': 'block' });
        break;
      case 'Alarmas':
        $('.page-filter').css({ 'display': 'block' });
        break;
      case 'Instrumentos':
        $('.page-filter').css({ 'display': 'block' });
        break;
      default:
        $('.page-filter').css({ 'display': 'none' });
    }
  }

  receiveMessage(event) {
    if (event.instrumento === undefined && event.service === undefined) {
      this.router.navigate(['/switch/tree']);
    } else {
      if (event.instrumento === undefined) {
        event.instrumento = '';
      }
      if (event.service === undefined) {
        event.service = '';
      }
      this.router.navigate(['/switch/tree', event.instrumento, event.service]);
    }
  }
}
