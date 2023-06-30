import { TestBed } from '@angular/core/testing';

import { PeopleWithoutEndpointsServiceService } from './people-without-endpoints-service.service';

describe('PeopleWithoutEndpointsServiceService', () => {
  let service: PeopleWithoutEndpointsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleWithoutEndpointsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
