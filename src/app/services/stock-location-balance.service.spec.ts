import { TestBed } from '@angular/core/testing';

import { StockLocationBalanceService } from './stock-location-balance.service';

describe('StockLocationBalanceService', () => {
  let service: StockLocationBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockLocationBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
