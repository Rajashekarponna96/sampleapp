import { TestBed } from '@angular/core/testing';

import { SaveItemLevelService } from './save-item-level.service';

describe('SaveItemLevelService', () => {
  let service: SaveItemLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveItemLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
