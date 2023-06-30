import { TestBed } from '@angular/core/testing';

import { StockItemInLocationService } from './stock-item-in-location.service';

describe('StockItemInLocationService', () => {
  let service: StockItemInLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockItemInLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
