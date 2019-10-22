import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterInstrumentosComponent } from './filter-instrumentos.component';

describe('FilterInstrumentosComponent', () => {
  let component: FilterInstrumentosComponent;
  let fixture: ComponentFixture<FilterInstrumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterInstrumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterInstrumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
