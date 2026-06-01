import { TestBed } from '@angular/core/testing';

import { Investigadores } from './investigadores';

describe('Investigadores', () => {
  let service: Investigadores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Investigadores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
