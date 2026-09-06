import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { PaginationComponent } from '../Components/pagination/pagination.component';
import { NotLoggedInComponent } from '../Components/not-logged-in/not-logged-in.component';
import { GroupsComponent } from '../Components/groups/groups.component';
import { ProblemDetailsComponent } from '../Components/problem-details/problem-details.component';
import { SubmitProblemComponent } from '../Components/submit-problem/submit-problem.component';
import { SubmitResultComponent } from '../Components/submit-result/submit-result.component';
import { CreateContestComponent } from '../Components/create-contest/create-contest.component';

import { HoursMinutesPipe } from '../pipes/hours-minutes/hours-minutes.pipe';
import { TimeAgoPipe } from '../pipes/time-ago/time-ago.pipe';
import { VerdictClassPipe } from '../pipes/verdict-class/verdict-class.pipe';

/**
 * Declarations used by more than one lazy feature.
 *
 * Anything reachable from two features lives here so the router does not have
 * to duplicate it into both chunks — in particular the submit/result dialogs
 * (problems, status and contests all open them) and CreateContestComponent
 * (opened from both the contests list and a group's page).
 */
const SHARED_DECLARATIONS = [
  PaginationComponent,
  NotLoggedInComponent,
  GroupsComponent,
  ProblemDetailsComponent,
  SubmitProblemComponent,
  SubmitResultComponent,
  CreateContestComponent,
  HoursMinutesPipe,
  TimeAgoPipe,
  VerdictClassPipe,
];

const SHARED_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  MatDialogModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: SHARED_DECLARATIONS,
  imports: SHARED_MODULES,
  exports: [...SHARED_DECLARATIONS, ...SHARED_MODULES],
})
export class SharedModule {}
