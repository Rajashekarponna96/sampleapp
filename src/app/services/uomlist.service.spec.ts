import { TestBed } from '@angular/core/testing';

import { UOMListService } from './uomlist.service';

describe('UOMListService', () => {
  let service: UOMListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UOMListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
