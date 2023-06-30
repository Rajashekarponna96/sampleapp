import { TestBed } from '@angular/core/testing';

import { SaveTransferService } from './save-transfer.service';

describe('SaveTransferService', () => {
  let service: SaveTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
