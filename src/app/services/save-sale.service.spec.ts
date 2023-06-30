import { TestBed } from '@angular/core/testing';

import { SaveSaleService } from './save-sale.service';

describe('SaveSaleService', () => {
  let service: SaveSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
