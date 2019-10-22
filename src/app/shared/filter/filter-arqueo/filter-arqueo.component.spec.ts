import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterArqueoComponent } from './filter-arqueo.component';

describe('FilterArqueoComponent', () => {
  let component: FilterArqueoComponent;
  let fixture: ComponentFixture<FilterArqueoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterArqueoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterArqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
