import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoCorreoComponent } from './grupo-correo.component';

describe('GrupoCorreoComponent', () => {
  let component: GrupoCorreoComponent;
  let fixture: ComponentFixture<GrupoCorreoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoCorreoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
