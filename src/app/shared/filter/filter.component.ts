import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {

  @Input() message: string;
  @Output() filter = new EventEmitter<any[]>();

  constructor(
  ) {
  }

  ngOnInit() {
    $.getScript('./assets/js/customizer.js');
    $.getScript('./assets/js/acordion.js');
  }

}
