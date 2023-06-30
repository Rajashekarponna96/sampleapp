import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkSupplyTaskSheetComponent } from './milk-supply-task-sheet.component';

describe('MilkSupplyTaskSheetComponent', () => {
  let component: MilkSupplyTaskSheetComponent;
  let fixture: ComponentFixture<MilkSupplyTaskSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilkSupplyTaskSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilkSupplyTaskSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
