import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleOperacionesComponent } from './detalle-operaciones.component';

describe('DetalleOperacionesComponent', () => {
  let component: DetalleOperacionesComponent;
  let fixture: ComponentFixture<DetalleOperacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleOperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
