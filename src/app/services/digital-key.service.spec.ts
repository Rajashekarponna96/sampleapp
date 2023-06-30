import { TestBed } from '@angular/core/testing';

import { DigitalKeyService } from './digital-key.service';

describe('DigitalKeyService', () => {
  let service: DigitalKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
