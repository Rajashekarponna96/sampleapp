import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyAccountHeadsComponent } from './party-account-heads.component';

describe('PartyAccountHeadsComponent', () => {
  let component: PartyAccountHeadsComponent;
  let fixture: ComponentFixture<PartyAccountHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyAccountHeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyAccountHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
