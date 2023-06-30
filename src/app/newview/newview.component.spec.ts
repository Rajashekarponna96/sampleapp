import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewviewComponent } from './newview.component';

describe('NewviewComponent', () => {
  let component: NewviewComponent;
  let fixture: ComponentFixture<NewviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
