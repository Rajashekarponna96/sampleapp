import { TestBed } from '@angular/core/testing';

import { UpdateFreshPersonService } from './update-fresh-person.service';

describe('UpdateFreshPersonService', () => {
  let service: UpdateFreshPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateFreshPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
