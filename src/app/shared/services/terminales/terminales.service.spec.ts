import { TestBed } from '@angular/core/testing';

import { TerminalesService } from './terminales.service';

describe('TerminalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TerminalesService = TestBed.get(TerminalesService);
    expect(service).toBeTruthy();
  });
});
