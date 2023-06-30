import { TestBed } from '@angular/core/testing';

import { ClosingStockService } from './closing-stock.service';

describe('ClosingStockService', () => {
  let service: ClosingStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClosingStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
