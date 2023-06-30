import { TestBed } from '@angular/core/testing';

import { FinalAccountsSimpleService } from './final-accounts-simple.service';

describe('FinalAccountsSimpleService', () => {
  let service: FinalAccountsSimpleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinalAccountsSimpleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
