import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleAndCompaniesComponent } from './people-and-companies.component';

describe('PeopleAndCompaniesComponent', () => {
  let component: PeopleAndCompaniesComponent;
  let fixture: ComponentFixture<PeopleAndCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleAndCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleAndCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
