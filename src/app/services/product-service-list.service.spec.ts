import { TestBed } from '@angular/core/testing';

import { ProductServiceListService } from './product-service-list.service';

describe('ProductServiceListService', () => {
  let service: ProductServiceListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductServiceListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
