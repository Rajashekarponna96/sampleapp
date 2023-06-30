import { TestBed } from '@angular/core/testing';

import { CheckPersonService } from './check-person.service';

describe('CheckPersonService', () => {
  let service: CheckPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
