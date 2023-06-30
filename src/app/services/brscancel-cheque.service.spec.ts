import { TestBed } from '@angular/core/testing';

import { BRSCancelChequeService } from './brscancel-cheque.service';

describe('BRSCancelChequeService', () => {
  let service: BRSCancelChequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BRSCancelChequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
