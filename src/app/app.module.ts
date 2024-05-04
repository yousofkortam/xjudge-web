
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
import { SharedModule } from './shared/shared.module';
import { HoursMinutesPipe } from './pipes/hours-minutes/hours-minutes.pipe';
import { CreateGroupComponent } from './Components/create-group/create-group.component';
import { SubmitResultComponent } from './Components/submit-result/submit-result.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContestDetailsComponent } from './Components/contest-details/contest-details.component';
import { MatSliderModule } from '@angular/material/slider';
import { HighlightJsModule } from 'ngx-highlight-js';
import { OverviewComponent } from './Components/overview/overview.component';
import { MatTabsModule } from '@angular/material/tabs';
import { StatusComponent } from './Components/status/status.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { TimeAgoPipe } from './pipes/time-ago/time-ago.pipe';

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
    SubmitResultComponent,
    ContestDetailsComponent,
    OverviewComponent,
    StatusComponent,
    ProfileComponent,
    TimeAgoPipe,
   ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    DataTablesModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSnackBarModule,
    NgOptimizedImage,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    HighlightJsModule ,
  
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
