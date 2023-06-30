import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalNameComponent } from './personal-name.component';

describe('PersonalNameComponent', () => {
  let component: PersonalNameComponent;
  let fixture: ComponentFixture<PersonalNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
