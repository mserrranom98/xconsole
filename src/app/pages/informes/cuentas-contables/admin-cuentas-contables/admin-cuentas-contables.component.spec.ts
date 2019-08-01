import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCuentasContablesComponent } from './admin-cuentas-contables.component';

describe('AdminCuentasContablesComponent', () => {
  let component: AdminCuentasContablesComponent;
  let fixture: ComponentFixture<AdminCuentasContablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCuentasContablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCuentasContablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
