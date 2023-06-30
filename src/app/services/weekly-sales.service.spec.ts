import { TestBed } from '@angular/core/testing';

import { WeeklySalesService } from './weekly-sales.service';

describe('WeeklySalesService', () => {
  let service: WeeklySalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklySalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
