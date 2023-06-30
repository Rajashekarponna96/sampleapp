import { TestBed } from '@angular/core/testing';

import { StockLocationListService } from './stock-location-list.service';

describe('StockLocationListService', () => {
  let service: StockLocationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockLocationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
