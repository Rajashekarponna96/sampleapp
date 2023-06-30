import { TestBed } from '@angular/core/testing';

import { SaveFreshPersonService } from './save-fresh-person.service';

describe('SaveFreshPersonService', () => {
  let service: SaveFreshPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveFreshPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
