import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoOpeComponent } from './turno-ope.component';

describe('TurnoOpeComponent', () => {
  let component: TurnoOpeComponent;
  let fixture: ComponentFixture<TurnoOpeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoOpeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoOpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
