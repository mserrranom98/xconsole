import {Component, OnInit} from '@angular/core';
import {ROUTES} from './sidebar-routes.config';
import {TranslateService} from '@ngx-translate/core';
import {PageMenu, Paginas, Login} from '../../models/usuario';
import {MenuService} from '../../services/menu.service';
import {VARGLOBAL} from '../../services/login-pass.service';
import {FullLayoutComponent} from '../../layouts/full/full-layout.component';

declare var $: any;

@Component({
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
    public translate: TranslateService,
    private fullLayout: FullLayoutComponent
  ) {
    this.pages = new PageMenu('', '', '', '', [{'argument': '', 'value': ''}]);
  }

  ngOnInit() {
    $.getScript('./assets/js/app-sidebar.js');
    $.getScript('./assets/js/vertical-timeline.js');
    this.pages.serviceName = 'AUTH_PAGES_MENU';
    this.pages.userToken = VARGLOBAL.userToken;
    this.pages.sessionUUID = VARGLOBAL.sessionUUID;
    this.pages.jsessionID = VARGLOBAL.jsessionID;
    this.pages.serviceArguments[0].argument = 'profile';
    this.pages.serviceArguments[0].value = VARGLOBAL.perfil;
    this.menu.cosultar(this.pages).subscribe(
      (result: any) => {
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

  /** (MS) - Muestra la pantalla de carga especificada en el index.html
   * @param event Contiene la lista seleccionada en el menu */
  openLoading(event) {
    if (event.path !== '' && event.isExternalLink === 'true') {
      this.fullLayout.filterMessage(event.title);
      if (event.path !== window.location.pathname.toString()) {
        $('.page-loading').css({'z-index': '999', 'opacity': '1'});
      }
    }
  }
}
