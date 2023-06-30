import { TestBed } from '@angular/core/testing';

import { BRSDetailService } from './brsdetail.service';

describe('BRSDetailService', () => {
  let service: BRSDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BRSDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
