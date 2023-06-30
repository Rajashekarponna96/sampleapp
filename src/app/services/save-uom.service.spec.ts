import { TestBed } from '@angular/core/testing';

import { SaveUOMService } from './save-uom.service';

describe('SaveUOMService', () => {
  let service: SaveUOMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveUOMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
