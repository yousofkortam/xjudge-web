import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SubmitProblemComponent } from './submit-problem.component';

describe('SubmitProblemComponent', () => {
  let component: SubmitProblemComponent;
  let fixture: ComponentFixture<SubmitProblemComponent>;

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
      declarations: [SubmitProblemComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {}, afterClosed: () => ({ subscribe: () => {} }) } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      // Child components are covered by their own specs; this one only checks
      // that SubmitProblemComponent itself builds and renders.
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(SubmitProblemComponent);
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
