import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPeopleAndCompaniesComponent } from './new-people-and-companies.component';

describe('NewPeopleAndCompaniesComponent', () => {
  let component: NewPeopleAndCompaniesComponent;
  let fixture: ComponentFixture<NewPeopleAndCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPeopleAndCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPeopleAndCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
