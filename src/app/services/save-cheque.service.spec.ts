import { TestBed } from '@angular/core/testing';

import { SaveChequeService } from './save-cheque.service';

describe('SaveChequeService', () => {
  let service: SaveChequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveChequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
