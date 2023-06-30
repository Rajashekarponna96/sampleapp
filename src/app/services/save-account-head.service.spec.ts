import { TestBed } from '@angular/core/testing';

import { SaveAccountHeadService } from './save-account-head.service';

describe('SaveAccountHeadService', () => {
  let service: SaveAccountHeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveAccountHeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
