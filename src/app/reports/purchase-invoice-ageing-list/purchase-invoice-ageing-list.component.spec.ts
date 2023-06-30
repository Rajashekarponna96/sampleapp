import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiceAgeingListComponent } from './purchase-invoice-ageing-list.component';

describe('PurchaseInvoiceAgeingListComponent', () => {
  let component: PurchaseInvoiceAgeingListComponent;
  let fixture: ComponentFixture<PurchaseInvoiceAgeingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseInvoiceAgeingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInvoiceAgeingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
