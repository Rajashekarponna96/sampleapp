import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailIDComponent } from './email-id.component';

describe('EmailIDComponent', () => {
  let component: EmailIDComponent;
  let fixture: ComponentFixture<EmailIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailIDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
