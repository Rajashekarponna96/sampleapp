import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBalanceRegisterComponent } from './stock-balance-register.component';

describe('StockBalanceRegisterComponent', () => {
  let component: StockBalanceRegisterComponent;
  let fixture: ComponentFixture<StockBalanceRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockBalanceRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBalanceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
