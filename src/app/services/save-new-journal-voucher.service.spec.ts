import { TestBed } from '@angular/core/testing';

import { SaveNewJournalVoucherService } from './save-new-journal-voucher.service';

describe('SaveNewJournalVoucherService', () => {
  let service: SaveNewJournalVoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveNewJournalVoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
