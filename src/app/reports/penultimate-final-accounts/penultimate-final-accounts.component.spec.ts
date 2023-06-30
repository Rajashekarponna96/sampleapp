import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenultimateFinalAccountsComponent } from './penultimate-final-accounts.component';

describe('PenultimateFinalAccountsComponent', () => {
  let component: PenultimateFinalAccountsComponent;
  let fixture: ComponentFixture<PenultimateFinalAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenultimateFinalAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PenultimateFinalAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
