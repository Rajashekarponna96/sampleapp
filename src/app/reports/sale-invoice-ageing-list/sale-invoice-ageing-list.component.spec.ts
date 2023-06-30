import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoiceAgeingListComponent } from './sale-invoice-ageing-list.component';

describe('SaleInvoiceAgeingListComponent', () => {
  let component: SaleInvoiceAgeingListComponent;
  let fixture: ComponentFixture<SaleInvoiceAgeingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleInvoiceAgeingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleInvoiceAgeingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
