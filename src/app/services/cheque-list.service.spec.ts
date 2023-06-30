import { TestBed } from '@angular/core/testing';

import { ChequeListService } from './cheque-list.service';

describe('ChequeListService', () => {
  let service: ChequeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChequeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
