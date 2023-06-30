import { TestBed } from '@angular/core/testing';

import { AccountsOfPersonService } from './accounts-of-person.service';

describe('AccountsOfPersonService', () => {
  let service: AccountsOfPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsOfPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
