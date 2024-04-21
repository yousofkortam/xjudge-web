import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemDetailsComponent } from './problem-details.component';

describe('ProblemDetailsComponent', () => {
  let component: ProblemDetailsComponent;
  let fixture: ComponentFixture<ProblemDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProblemDetailsComponent]
    });
    fixture = TestBed.createComponent(ProblemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
