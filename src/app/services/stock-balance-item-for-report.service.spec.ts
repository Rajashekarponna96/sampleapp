import { TestBed } from '@angular/core/testing';

import { StockBalanceItemForReportService } from './stock-balance-item-for-report.service';

describe('StockBalanceItemForReportService', () => {
  let service: StockBalanceItemForReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockBalanceItemForReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
