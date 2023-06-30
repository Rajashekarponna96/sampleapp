import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XetaproductsComponent } from './xetaproducts.component';

describe('XetaproductsComponent', () => {
  let component: XetaproductsComponent;
  let fixture: ComponentFixture<XetaproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XetaproductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XetaproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
