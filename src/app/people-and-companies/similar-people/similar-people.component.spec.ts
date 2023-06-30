import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarPeopleComponent } from './similar-people.component';

describe('SimilarPeopleComponent', () => {
  let component: SimilarPeopleComponent;
  let fixture: ComponentFixture<SimilarPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimilarPeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
