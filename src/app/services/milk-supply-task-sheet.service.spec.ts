import { TestBed } from '@angular/core/testing';

import { MilkSupplyTaskSheetService } from './milk-supply-task-sheet.service';

describe('MilkSupplyTaskSheetService', () => {
  let service: MilkSupplyTaskSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilkSupplyTaskSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
