import { Component, OnInit } from '@angular/core';
import { VARGLOBAL } from '../../services/login-pass.service';

@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss']
})

export class FullLayoutComponent implements OnInit {
    src: string;
    image: string;

    constructor() {
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
}
