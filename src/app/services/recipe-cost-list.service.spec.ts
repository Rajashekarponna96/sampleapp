import { TestBed } from '@angular/core/testing';

import { RecipeCostListService } from './recipe-cost-list.service';

describe('RecipeCostListService', () => {
  let service: RecipeCostListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeCostListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
