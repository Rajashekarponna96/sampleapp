import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAndAccountingComponent } from './control-and-accounting.component';

describe('ControlAndAccountingComponent', () => {
  let component: ControlAndAccountingComponent;
  let fixture: ComponentFixture<ControlAndAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAndAccountingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAndAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
