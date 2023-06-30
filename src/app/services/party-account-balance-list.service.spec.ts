import { TestBed } from '@angular/core/testing';

import { PartyAccountBalanceListService } from './party-account-balance-list.service';

describe('PartyAccountBalanceListService', () => {
  let service: PartyAccountBalanceListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartyAccountBalanceListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
