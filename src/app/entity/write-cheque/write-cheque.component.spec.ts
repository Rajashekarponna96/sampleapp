import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteChequeComponent } from './write-cheque.component';

describe('WriteChequeComponent', () => {
  let component: WriteChequeComponent;
  let fixture: ComponentFixture<WriteChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteChequeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
