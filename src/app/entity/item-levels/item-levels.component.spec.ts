import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLevelsComponent } from './item-levels.component';

describe('ItemLevelsComponent', () => {
  let component: ItemLevelsComponent;
  let fixture: ComponentFixture<ItemLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemLevelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
