import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalAccountsSimpleComponent } from './final-accounts-simple.component';

describe('FinalAccountsSimpleComponent', () => {
  let component: FinalAccountsSimpleComponent;
  let fixture: ComponentFixture<FinalAccountsSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalAccountsSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalAccountsSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
