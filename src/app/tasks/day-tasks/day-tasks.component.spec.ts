import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTasksComponent } from './day-tasks.component';

describe('DayTasksComponent', () => {
  let component: DayTasksComponent;
  let fixture: ComponentFixture<DayTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
