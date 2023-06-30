import { TestBed } from '@angular/core/testing';

import { AccountHeadListService } from './account-head-list.service';

describe('AccountHeadListService', () => {
  let service: AccountHeadListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountHeadListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
