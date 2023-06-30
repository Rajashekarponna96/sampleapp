import { TestBed } from '@angular/core/testing';

import { PurchaseinvoiceAgeingListService } from './purchaseinvoice-ageing-list.service';

describe('PurchaseinvoiceAgeingListService', () => {
  let service: PurchaseinvoiceAgeingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseinvoiceAgeingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
