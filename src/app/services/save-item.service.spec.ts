import { TestBed } from '@angular/core/testing';

import { SaveItemService } from './save-item.service';

describe('SaveItemService', () => {
  let service: SaveItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
