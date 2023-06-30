import { TestBed } from '@angular/core/testing';

import { UpdateSaleInvoiceService } from './update-sale-invoice.service';

describe('UpdateSaleInvoiceService', () => {
  let service: UpdateSaleInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateSaleInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
