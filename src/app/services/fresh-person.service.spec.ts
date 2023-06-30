import { TestBed } from '@angular/core/testing';

import { FreshPersonService } from './fresh-person.service';

describe('FreshPersonService', () => {
  let service: FreshPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreshPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
