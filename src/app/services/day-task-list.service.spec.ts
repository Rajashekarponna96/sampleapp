import { TestBed } from '@angular/core/testing';

import { DayTaskListService } from './day-task-list.service';

describe('DayTaskListService', () => {
  let service: DayTaskListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayTaskListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
