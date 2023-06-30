import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherAccountHeadsComponent } from './other-account-heads.component';

describe('OtherAccountHeadsComponent', () => {
  let component: OtherAccountHeadsComponent;
  let fixture: ComponentFixture<OtherAccountHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherAccountHeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherAccountHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
