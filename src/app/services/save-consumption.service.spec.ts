import { TestBed } from '@angular/core/testing';

import { SaveConsumptionService } from './save-consumption.service';

describe('SaveConsumptionService', () => {
  let service: SaveConsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveConsumptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
