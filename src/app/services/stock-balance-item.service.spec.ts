import { TestBed } from '@angular/core/testing';

import { StockBalanceItemService } from './stock-balance-item.service';

describe('StockBalanceItemService', () => {
  let service: StockBalanceItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockBalanceItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
