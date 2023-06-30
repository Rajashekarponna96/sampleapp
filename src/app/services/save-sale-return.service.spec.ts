import { TestBed } from '@angular/core/testing';

import { SaveSaleReturnService } from './save-sale-return.service';

describe('SaveSaleReturnService', () => {
  let service: SaveSaleReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveSaleReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
