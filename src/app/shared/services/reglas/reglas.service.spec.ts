import { TestBed } from '@angular/core/testing';

import { ReglasService } from './reglas.service';

describe('ReglasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReglasService = TestBed.get(ReglasService);
    expect(service).toBeTruthy();
  });
});
