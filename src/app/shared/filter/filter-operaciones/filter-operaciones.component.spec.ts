import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOperacionesComponent } from './filter-operaciones.component';

describe('FilterOperacionesComponent', () => {
  let component: FilterOperacionesComponent;
  let fixture: ComponentFixture<FilterOperacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterOperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
