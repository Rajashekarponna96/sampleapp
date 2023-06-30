import { TestBed } from '@angular/core/testing';

import { SaveReceiptService } from './save-receipt.service';

describe('SaveReceiptService', () => {
  let service: SaveReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveReceiptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
