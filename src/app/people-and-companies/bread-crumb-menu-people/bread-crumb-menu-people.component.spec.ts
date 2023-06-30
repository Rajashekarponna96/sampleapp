import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbMenuPeopleComponent } from './bread-crumb-menu-people.component';

describe('BreadCrumbMenuPeopleComponent', () => {
  let component: BreadCrumbMenuPeopleComponent;
  let fixture: ComponentFixture<BreadCrumbMenuPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreadCrumbMenuPeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadCrumbMenuPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
