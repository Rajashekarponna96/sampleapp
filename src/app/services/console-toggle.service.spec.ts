import { TestBed } from '@angular/core/testing';

import { ConsoleToggleService } from './console-toggle.service';

describe('ConsoleToggleService', () => {
  let service: ConsoleToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsoleToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
