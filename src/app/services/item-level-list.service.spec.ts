import { TestBed } from '@angular/core/testing';

import { ItemLevelListService } from './item-level-list.service';

describe('ItemLevelListService', () => {
  let service: ItemLevelListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemLevelListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
