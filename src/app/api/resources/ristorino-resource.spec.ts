import { TestBed } from '@angular/core/testing';

import { RistorinoResource } from './ristorino-resource';

describe('RistorinoResource', () => {
  let service: RistorinoResource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RistorinoResource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
