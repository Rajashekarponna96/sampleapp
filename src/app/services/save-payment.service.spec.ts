import { TestBed } from '@angular/core/testing';

import { SavePaymentService } from './save-payment.service';

describe('SavePaymentService', () => {
  let service: SavePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
