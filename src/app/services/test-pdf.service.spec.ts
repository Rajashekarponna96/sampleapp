import { TestBed } from '@angular/core/testing';

import { TestPDFService } from './test-pdf.service';

describe('TestPDFService', () => {
  let service: TestPDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestPDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
