import { TestBed } from '@angular/core/testing';

import { SaveOrderService } from './save-order.service';

describe('SaveOrderService', () => {
  let service: SaveOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
