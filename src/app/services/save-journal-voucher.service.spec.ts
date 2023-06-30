import { TestBed } from '@angular/core/testing';

import { SaveJournalVoucherService } from './save-journal-voucher.service';

describe('SaveJournalVoucherService', () => {
  let service: SaveJournalVoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveJournalVoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
