import { TestBed } from '@angular/core/testing';

import { TrailingFinalAccountsService } from './trailing-final-accounts.service';

describe('TrailingFinalAccountsService', () => {
  let service: TrailingFinalAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrailingFinalAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
