import { TestBed } from '@angular/core/testing';

import { UpdatePersonService } from './update-person.service';

describe('UpdatePersonService', () => {
  let service: UpdatePersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatePersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
