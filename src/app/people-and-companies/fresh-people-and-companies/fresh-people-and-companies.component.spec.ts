import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshPeopleAndCompaniesComponent } from './fresh-people-and-companies.component';

describe('FreshPeopleAndCompaniesComponent', () => {
  let component: FreshPeopleAndCompaniesComponent;
  let fixture: ComponentFixture<FreshPeopleAndCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreshPeopleAndCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshPeopleAndCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
