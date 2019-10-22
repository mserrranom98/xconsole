import { TestBed } from '@angular/core/testing';

import { UsuarioSucursalService } from './usuario-sucursal.service';

describe('UsuarioSucursalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsuarioSucursalService = TestBed.get(UsuarioSucursalService);
    expect(service).toBeTruthy();
  });
});
