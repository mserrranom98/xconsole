import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioSucursalComponent } from './usuario-sucursal.component';

describe('UsuarioSucursalComponent', () => {
  let component: UsuarioSucursalComponent;
  let fixture: ComponentFixture<UsuarioSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
