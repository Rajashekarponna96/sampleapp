import { TestBed } from '@angular/core/testing';

import { UpdateClassificationService } from './update-classification.service';

describe('UpdateClassificationService', () => {
  let service: UpdateClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
