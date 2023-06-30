import { TestBed } from '@angular/core/testing';

import { GenerateTasksService } from './generate-tasks.service';

describe('GenerateTasksService', () => {
  let service: GenerateTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
