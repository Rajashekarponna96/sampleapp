import { TestBed } from '@angular/core/testing';

import { ClassificationListService } from './classification-list.service';

describe('ClassificationListService', () => {
  let service: ClassificationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassificationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
