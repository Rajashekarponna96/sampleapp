import { TestBed } from '@angular/core/testing';

import { JournalVoucherListService } from './journal-voucher-list.service';

describe('JournalVoucherListService', () => {
  let service: JournalVoucherListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalVoucherListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
