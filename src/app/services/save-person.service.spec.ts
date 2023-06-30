import { TestBed } from '@angular/core/testing';

import { SavePersonService } from './save-person.service';

describe('SavePersonService', () => {
  let service: SavePersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavePersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
