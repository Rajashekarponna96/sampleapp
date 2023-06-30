import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewViewItemsComponent } from './new-view-items.component';

describe('NewViewItemsComponent', () => {
  let component: NewViewItemsComponent;
  let fixture: ComponentFixture<NewViewItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewViewItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewViewItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
