import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJournalVoucherComponent } from './new-journal-voucher.component';

describe('NewJournalVoucherComponent', () => {
  let component: NewJournalVoucherComponent;
  let fixture: ComponentFixture<NewJournalVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewJournalVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewJournalVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
