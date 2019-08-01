import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionCuentasContablesComponent } from './asignacion-cuentas-contables.component';

describe('AsignacionCuentasContablesComponent', () => {
  let component: AsignacionCuentasContablesComponent;
  let fixture: ComponentFixture<AsignacionCuentasContablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionCuentasContablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionCuentasContablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
