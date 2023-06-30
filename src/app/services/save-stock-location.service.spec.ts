import { TestBed } from '@angular/core/testing';

import { SaveStockLocationService } from './save-stock-location.service';

describe('SaveStockLocationService', () => {
  let service: SaveStockLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveStockLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
