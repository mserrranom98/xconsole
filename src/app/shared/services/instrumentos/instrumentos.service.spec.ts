import { TestBed } from '@angular/core/testing';

import { InstrumentosService } from './instrumentos.service';

describe('InstrumentosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstrumentosService = TestBed.get(InstrumentosService);
    expect(service).toBeTruthy();
  });
});
