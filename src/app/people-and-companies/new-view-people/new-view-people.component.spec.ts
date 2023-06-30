import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewViewPeopleComponent } from './new-view-people.component';

describe('NewViewPeopleComponent', () => {
  let component: NewViewPeopleComponent;
  let fixture: ComponentFixture<NewViewPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewViewPeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewViewPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
