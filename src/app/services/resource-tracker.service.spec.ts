import { TestBed } from '@angular/core/testing';

import { ResourceTrackerService } from './resource-tracker.service';

describe('ResourceTrackerService', () => {
  let service: ResourceTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
