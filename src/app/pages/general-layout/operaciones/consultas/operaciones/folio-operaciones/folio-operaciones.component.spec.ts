import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioOperacionesComponent } from './folio-operaciones.component';

describe('FolioOperacionesComponent', () => {
  let component: FolioOperacionesComponent;
  let fixture: ComponentFixture<FolioOperacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioOperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
