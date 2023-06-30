import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalAccountsComponent } from './final-accounts.component';

describe('FinalAccountsComponent', () => {
  let component: FinalAccountsComponent;
  let fixture: ComponentFixture<FinalAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
