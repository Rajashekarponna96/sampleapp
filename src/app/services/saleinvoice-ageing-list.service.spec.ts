import { TestBed } from '@angular/core/testing';

import { SaleinvoiceAgeingListService } from './saleinvoice-ageing-list.service';

describe('SaleinvoiceAgeingListService', () => {
  let service: SaleinvoiceAgeingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleinvoiceAgeingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
