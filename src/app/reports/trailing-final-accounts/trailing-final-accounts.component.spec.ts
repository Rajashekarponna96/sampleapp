import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailingFinalAccountsComponent } from './trailing-final-accounts.component';

describe('TrailingFinalAccountsComponent', () => {
  let component: TrailingFinalAccountsComponent;
  let fixture: ComponentFixture<TrailingFinalAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailingFinalAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailingFinalAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
