import { TestBed } from '@angular/core/testing';

import { SaveProductionService } from './save-production.service';

describe('SaveProductionService', () => {
  let service: SaveProductionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveProductionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
