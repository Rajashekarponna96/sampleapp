import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XetaSetupComponent } from './xeta-setup.component';

describe('XetaSetupComponent', () => {
  let component: XetaSetupComponent;
  let fixture: ComponentFixture<XetaSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XetaSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XetaSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
