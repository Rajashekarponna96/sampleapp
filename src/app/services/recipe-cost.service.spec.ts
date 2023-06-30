import { TestBed } from '@angular/core/testing';

import { RecipeCostService } from './recipe-cost.service';

describe('RecipeCostService', () => {
  let service: RecipeCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
