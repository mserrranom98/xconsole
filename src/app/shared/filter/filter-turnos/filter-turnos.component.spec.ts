import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTurnosComponent } from './filter-turnos.component';

describe('FilterTurnosComponent', () => {
  let component: FilterTurnosComponent;
  let fixture: ComponentFixture<FilterTurnosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTurnosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
