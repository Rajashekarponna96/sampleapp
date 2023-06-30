import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquityPayableComponent } from './equity-payable.component';

describe('EquityPayableComponent', () => {
  let component: EquityPayableComponent;
  let fixture: ComponentFixture<EquityPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquityPayableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquityPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
