import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ContestProblemComponent } from './contest-problem.component';

describe('ContestProblemComponent', () => {
  let component: ContestProblemComponent;
  let fixture: ComponentFixture<ContestProblemComponent>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      declarations: [ContestProblemComponent],
      providers: [],
      // Child components are covered by their own specs; this one only checks
      // that ContestProblemComponent itself builds and renders.
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContestProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders without throwing', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
