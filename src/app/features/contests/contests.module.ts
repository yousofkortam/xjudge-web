import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { ContestComponent } from '../../Components/contest/contest.component';
import { ContestDetailsComponent } from '../../Components/contest-details/contest-details.component';
import { ContestProblemComponent } from '../../Components/contest-problem/contest-problem.component';
import { ContestRankComponent } from '../../Components/contest-rank/contest-rank.component';
import { ContestStatusComponent } from '../../Components/contest-status/contest-status.component';
import { OverviewComponent } from '../../Components/overview/overview.component';
import { UpdateContestComponent } from '../../Components/update-contest/update-contest.component';

const routes: Routes = [
  { path: '', component: ContestComponent, title: 'Contests · X-Judge' },
  { path: ':contestId', component: ContestDetailsComponent },
  { path: ':contestId/problem/:hashTag', component: ContestProblemComponent },
];

@NgModule({
  declarations: [
    ContestComponent,
    ContestDetailsComponent,
    ContestProblemComponent,
    ContestRankComponent,
    ContestStatusComponent,
    OverviewComponent,
    UpdateContestComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ContestsModule {}
