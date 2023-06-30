import { TestBed } from '@angular/core/testing';

import { PeopleFreshService } from './people-fresh.service';

describe('PeopleFreshService', () => {
  let service: PeopleFreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleFreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
