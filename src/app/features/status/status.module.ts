import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { StatusComponent } from '../../Components/status/status.component';

const routes: Routes = [
  { path: '', component: StatusComponent, title: 'Status · X-Judge' },
];

@NgModule({
  declarations: [StatusComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class StatusModule {}
