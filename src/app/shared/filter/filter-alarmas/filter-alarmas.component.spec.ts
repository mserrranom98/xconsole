import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAlarmasComponent } from './filter-alarmas.component';

describe('FilterAlarmasComponent', () => {
  let component: FilterAlarmasComponent;
  let fixture: ComponentFixture<FilterAlarmasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterAlarmasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAlarmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
