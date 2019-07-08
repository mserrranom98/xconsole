import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { TranslateService } from '@ngx-translate/core';
import { PageMenu, Paginas, Login } from '../../models/usuario';
import { MenuService } from '../../services/menu.service';
import { VARGLOBAL } from '../../services/login-pass.service';

declare var $: any;
@Component({
    // moduleId: module.id,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public menuDesktop: any[];
    public pages: PageMenu;
    serviceName: string;
    userToken: string;
    public paginas: Paginas[];
    public usuario: Login;

    constructor(
        private menu: MenuService,
        public translate: TranslateService
    ) {
        this.pages = new PageMenu('', '', '', '', [{ 'argument': '', 'value': '' }]);
    }

    ngOnInit() {
        $.getScript('./assets/js/app-sidebar.js');
        $.getScript('./assets/js/vertical-timeline.js');
        // this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.pages.serviceName = 'AUTH_PAGES_MENU';
        this.pages.userToken = VARGLOBAL.userToken;
        this.pages.sessionUUID = VARGLOBAL.sessionUUID;
        this.pages.jsessionID = VARGLOBAL.jsessionID;
        this.pages.serviceArguments[0].argument = 'profile';
        this.pages.serviceArguments[0].value = VARGLOBAL.perfil;
        this.menu.cosultar(this.pages).subscribe(
            (result:any) => {
                if (VARGLOBAL.user === 'admin') {
                    this.menuDesktop = ROUTES.filter(menuItem => menuItem);
                } else {
                    this.paginas = result.routeInfo;
                    this.menuItems = this.paginas;
                }
            },
            error => {
                console.log(<any>error);
            }
        );

    }
}
