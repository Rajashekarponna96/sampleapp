import { TestBed } from '@angular/core/testing';

import { ChequesOfPersonService } from './cheques-of-person.service';

describe('ChequesOfPersonService', () => {
  let service: ChequesOfPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChequesOfPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
