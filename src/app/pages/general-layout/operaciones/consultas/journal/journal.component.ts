import {Component, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {JournalService} from '../../../../pages-services/serv-general/journal.service';
import swal from 'sweetalert2';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html'
})

export class JournalComponent implements OnInit {
  @ViewChild(DatatableComponent) tblList: DatatableComponent;

  journal = [];

  noDataText = 'No hay datos que mostrar';

  constructor(
    private journalService: JournalService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['fi'] != null && params['fi'] !== 'undefined') {
        $('.page-loading').css({'z-index': '999', 'opacity': '1'});
        const filterJou = JSON.parse(params['fi']);
        this.getJournal(filterJou);
      } else {
        const filterJou = [{
          startDate: this.formatoFechaString('00:00:00'),
          endDate: this.formatoFechaString('23:59:59'),
          rex: '',
          eps: '',
          terminalList: '',
          sucursalList: [],
          userName: '',
          peticion: ''
        }];
        this.getJournal(filterJou[0]);
      }
    });

  }

  getJournal(filter) {
    this.journalService.getJournal(filter).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Journal', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
      } else {
        if (response.eventCount !== '0') {
          this.journal = response.events;
        }
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    });
  }

  /** (MS) - Devuelve un string fecha actual con el formato YYYY-MM-dd hh:mm:ss
   * @return fecha */
  formatoFechaString(hora: string): String {
    const date = new Date();
    const fecha = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
    let dd = fecha.day.toString();
    let mm = fecha.month.toString();

    if (fecha.day < 10) {
      dd = '0' + fecha.day;
    }
    if (fecha.month < 10) {
      mm = '0' + fecha.month;
    }

    return fecha.year + '-' + mm + '-' + dd + ' ' + hora;
  }
}

