import { TestBed } from '@angular/core/testing';

import { SavePurchaseReturnService } from './save-purchase-return.service';

describe('SavePurchaseReturnService', () => {
  let service: SavePurchaseReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavePurchaseReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
