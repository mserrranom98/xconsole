import { TestBed } from '@angular/core/testing';

import { IntegrantesService } from './integrantes.service';

describe('IntegrantesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntegrantesService = TestBed.get(IntegrantesService);
    expect(service).toBeTruthy();
  });
});
