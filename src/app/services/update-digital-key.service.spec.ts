import { TestBed } from '@angular/core/testing';

import { UpdateDigitalKeyService } from './update-digital-key.service';

describe('UpdateDigitalKeyService', () => {
  let service: UpdateDigitalKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateDigitalKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
