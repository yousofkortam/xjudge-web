import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { FooterComponent } from './Components/footer/footer.component';
import { GroupComponent } from './Components/group/group.component';
import { ContestComponent } from './Components/contest/contest.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { ProblemComponent } from './Components/problem/problem.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { PaginationComponent } from './Components/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProblemDetailsComponent } from './Components/problem-details/problem-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SubmitProblemComponent } from './Components/submit-problem/submit-problem.component';
import { NgOptimizedImage } from '@angular/common';
import { CreateContestComponent } from './Components/create-contest/create-contest.component';
import { HoursMinutesPipe } from './pipes/hours-minutes/hours-minutes.pipe';
import { CreateGroupComponent } from './Components/create-group/create-group.component';
import { MyGroupsComponent } from './Components/my-groups/my-groups.component';
import { ExploreGroupsComponent } from './Components/explore-groups/explore-groups.component';
import { GroupsComponent } from './Components/groups/groups.component';
import { SubmitResultComponent } from './Components/submit-result/submit-result.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContestDetailsComponent } from './Components/contest-details/contest-details.component';
import { MatSliderModule } from '@angular/material/slider';
import { OverviewComponent } from './Components/overview/overview.component';
import { StatusComponent } from './Components/status/status.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { TimeAgoPipe } from './pipes/time-ago/time-ago.pipe';
import { ContestStatusComponent } from './Components/contest-status/contest-status.component';
import { ContestRankComponent } from './Components/contest-rank/contest-rank.component';
import { UpdateProfileComponent } from './Components/update-profile/update-profile.component';
import { GroupDetailsComponent } from './Components/group-details/group-details.component';
import { ContestProblemComponent } from './Components/contest-problem/contest-problem.component';
import { InviteUserComponent } from './Components/invite-user/invite-user.component';
<<<<<<< HEAD
import { InvitationComponent } from './Components/invitation/invitation.component';
=======
import { UpdateContestComponent } from './Components/update-contest/update-contest.component';
>>>>>>> e0dbe9716b396005a07ad194ec04106c6c1cb55f

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    GroupComponent,
    ContestComponent,
    LoginComponent,
    RegisterComponent,
    ProblemComponent,
    NotFoundComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    PaginationComponent,
    ProblemDetailsComponent,
    SubmitProblemComponent,
    CreateContestComponent,
    HoursMinutesPipe,
    CreateGroupComponent,
    MyGroupsComponent,
    ExploreGroupsComponent,
    GroupsComponent,
    SubmitResultComponent,
    ContestDetailsComponent,
    SubmitResultComponent,
    ContestDetailsComponent,
    OverviewComponent,
    StatusComponent,
    ProfileComponent,
    TimeAgoPipe,
    ContestStatusComponent,
    ContestRankComponent,
    UpdateProfileComponent,
    GroupDetailsComponent,
    ContestProblemComponent,
    InviteUserComponent,
    InvitationComponent,
    UpdateContestComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSnackBarModule,
    NgOptimizedImage,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
