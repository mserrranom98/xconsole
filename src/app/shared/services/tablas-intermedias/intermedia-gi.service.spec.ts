import { TestBed } from '@angular/core/testing';

import { IntermediaGIService } from './intermedia-gi.service';

describe('IntermediaGIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntermediaGIService = TestBed.get(IntermediaGIService);
    expect(service).toBeTruthy();
  });
});
