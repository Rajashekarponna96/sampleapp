import { TestBed } from '@angular/core/testing';

import { UltimateFinalAccountsService } from './ultimate-final-accounts.service';

describe('UltimateFinalAccountsService', () => {
  let service: UltimateFinalAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UltimateFinalAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
