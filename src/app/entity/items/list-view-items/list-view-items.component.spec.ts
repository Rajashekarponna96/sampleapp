import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewItemsComponent } from './list-view-items.component';

describe('ListViewItemsComponent', () => {
  let component: ListViewItemsComponent;
  let fixture: ComponentFixture<ListViewItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListViewItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
