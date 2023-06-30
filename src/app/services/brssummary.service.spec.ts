import { TestBed } from '@angular/core/testing';

import { BRSSummaryService } from './brssummary.service';

describe('BRSSummaryService', () => {
  let service: BRSSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BRSSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
