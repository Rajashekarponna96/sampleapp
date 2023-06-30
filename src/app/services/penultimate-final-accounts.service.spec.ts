import { TestBed } from '@angular/core/testing';

import { PenultimateFinalAccountsService } from './penultimate-final-accounts.service';

describe('PenultimateFinalAccountsService', () => {
  let service: PenultimateFinalAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenultimateFinalAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
