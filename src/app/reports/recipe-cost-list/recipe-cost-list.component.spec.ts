import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCostListComponent } from './recipe-cost-list.component';

describe('RecipeCostListComponent', () => {
  let component: RecipeCostListComponent;
  let fixture: ComponentFixture<RecipeCostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeCostListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
