import { TestBed } from '@angular/core/testing';

import { FinalAccountsService } from './final-accounts.service';

describe('FinalAccountsService', () => {
  let service: FinalAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinalAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
