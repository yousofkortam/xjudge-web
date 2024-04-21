import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitProblemComponent } from './submit-problem.component';

describe('SubmitProblemComponent', () => {
  let component: SubmitProblemComponent;
  let fixture: ComponentFixture<SubmitProblemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitProblemComponent]
    });
    fixture = TestBed.createComponent(SubmitProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
