import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProblemComponent } from '../../Components/problem/problem.component';
import { ProblemDetailsComponent } from '../../Components/problem-details/problem-details.component';

const routes: Routes = [
  { path: '', component: ProblemComponent, title: 'Problems · X-Judge' },
  { path: ':source/:problemCode', component: ProblemDetailsComponent },
];

@NgModule({
  declarations: [ProblemComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ProblemsModule {}
