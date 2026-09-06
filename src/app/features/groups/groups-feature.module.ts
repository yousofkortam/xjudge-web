import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { GroupComponent } from '../../Components/group/group.component';
import { GroupDetailsComponent } from '../../Components/group-details/group-details.component';
import { MyGroupsComponent } from '../../Components/my-groups/my-groups.component';
import { ExploreGroupsComponent } from '../../Components/explore-groups/explore-groups.component';
import { InvitationComponent } from '../../Components/invitation/invitation.component';
import { CreateGroupComponent } from '../../Components/create-group/create-group.component';
import { InviteUserComponent } from '../../Components/invite-user/invite-user.component';
import { ProtectedAuthGuard } from '../../Guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: GroupComponent,
    children: [
      { path: '', redirectTo: 'exploreGroups', pathMatch: 'full' },
      { path: 'myGroups', component: MyGroupsComponent },
      { path: 'exploreGroups', component: ExploreGroupsComponent },
      { path: 'invitations', component: InvitationComponent },
    ],
  },
  { path: 'create', component: CreateGroupComponent, canActivate: [ProtectedAuthGuard] },
  { path: ':groupId', component: GroupDetailsComponent },
];

@NgModule({
  declarations: [
    GroupComponent,
    GroupDetailsComponent,
    MyGroupsComponent,
    ExploreGroupsComponent,
    InvitationComponent,
    CreateGroupComponent,
    InviteUserComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class GroupsFeatureModule {}
