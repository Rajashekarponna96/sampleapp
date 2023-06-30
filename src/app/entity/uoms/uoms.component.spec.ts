import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UOMSComponent } from './uoms.component';

describe('UOMSComponent', () => {
  let component: UOMSComponent;
  let fixture: ComponentFixture<UOMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UOMSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UOMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
