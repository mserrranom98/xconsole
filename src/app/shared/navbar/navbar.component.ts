import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginPassService, VARGLOBAL } from '../../services/login-pass.service';
import { Logout } from '../../models/usuario';

//import { NotiSelect } from '../../pages/pages-models/model-global';
//import { NotificacionService } from '../../pages/pages-services/serv-reca/notificacion.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    public usuario: Logout;
    currentLang = 'es';
    toggleClass = 'ft-maximize';
//    not: NotiSelect;
    count = 0;
    listNoti = [];
    ver = 0;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private loginPassService: LoginPassService,
        public translate: TranslateService,
//        public notificacionService: NotificacionService
    ) {
        this.usuario = new Logout('', '', '', '', '');
        const browserLang: string = translate.getBrowserLang();
        translate.use(browserLang.match(/en|es/) ? browserLang : 'es');
//        this.not = new NotiSelect('', '');
    }

    ngOnInit() {
       /* if (this.ver === 0) {
            this.anyNotificacion();
        } else {
            setInterval(() => {
                this.anyNotificacion();
            }, 100000);
        }*/
    }

/*    anyNotificacion() {
        this.notificacionService.anyNoti(this.not).subscribe(
            response => {
                if (response.count !== '0') {
                    this.count = response.count;
                }
            },
            error => {
                console.log('Error: ' + JSON.stringify(error));
            })
            this.ver = 1;
            this.ngOnInit();
    }

    getNotificacion() {
        this.notificacionService.getNoti(this.not).subscribe(
            result => {
                if (result.rowCount > 0) {
                    this.listNoti = result.rows;
                }
            },
            error => {
                console.log('Error: ' + JSON.stringify(error));
            })
    }
*/
    onLogout() {
        this.usuario.userName = VARGLOBAL.user;
        this.usuario.sessionUUID = VARGLOBAL.sessionUUID;
        this.usuario.jsessionID = VARGLOBAL.jsessionID;
        this.usuario.userToken = VARGLOBAL.userToken;
        this.usuario.directoryName = VARGLOBAL.directory;
        this.loginPassService.doLogout(this.usuario).subscribe(
            (response:any) => {
                if (response.messageCode = '0') {
                    VARGLOBAL.user = '';
                    VARGLOBAL.sessionUUID = '';
                    VARGLOBAL.jsessionID = '';
                    VARGLOBAL.userToken = '';
                    VARGLOBAL.directory = '';
                    this.router.navigate(['/login'], { relativeTo: this.route.parent });
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    ChangeLanguage(language: string) {
        this.translate.use(language);
    }

    ToggleClass() {
        if (this.toggleClass === 'ft-maximize') {
            this.toggleClass = 'ft-minimize';
        } else {
            this.toggleClass = 'ft-maximize';
        }
    }

    volver() {
        window.close();
    }
}

