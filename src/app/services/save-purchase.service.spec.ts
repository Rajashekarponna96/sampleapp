import { TestBed } from '@angular/core/testing';

import { SavePurchaseService } from './save-purchase.service';

describe('SavePurchaseService', () => {
  let service: SavePurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavePurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
