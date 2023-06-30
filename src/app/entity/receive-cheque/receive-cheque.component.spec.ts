import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveChequeComponent } from './receive-cheque.component';

describe('ReceiveChequeComponent', () => {
  let component: ReceiveChequeComponent;
  let fixture: ComponentFixture<ReceiveChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveChequeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
