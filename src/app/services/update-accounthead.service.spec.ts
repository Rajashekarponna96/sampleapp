import { TestBed } from '@angular/core/testing';

import { UpdateAccountheadService } from './update-accounthead.service';

describe('UpdateAccountheadService', () => {
  let service: UpdateAccountheadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateAccountheadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
