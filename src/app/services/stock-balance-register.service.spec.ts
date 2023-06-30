import { TestBed } from '@angular/core/testing';

import { StockBalanceRegisterService } from './stock-balance-register.service';

describe('StockBalanceRegisterService', () => {
  let service: StockBalanceRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockBalanceRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
