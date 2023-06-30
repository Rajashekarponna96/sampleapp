import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFinalAccountsComponent } from './new-final-accounts.component';

describe('NewFinalAccountsComponent', () => {
  let component: NewFinalAccountsComponent;
  let fixture: ComponentFixture<NewFinalAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFinalAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFinalAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
