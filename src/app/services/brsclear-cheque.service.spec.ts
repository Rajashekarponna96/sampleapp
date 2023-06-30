import { TestBed } from '@angular/core/testing';

import { BRSClearChequeService } from './brsclear-cheque.service';

describe('BRSClearChequeService', () => {
  let service: BRSClearChequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BRSClearChequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
