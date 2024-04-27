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
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProblemDetailsComponent } from './Components/problem-details/problem-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SubmitProblemComponent } from './Components/submit-problem/submit-problem.component';
import { NgOptimizedImage } from '@angular/common';
import { StatusComponent } from './Components/status/status.component';
import { CreateContestComponent } from './Components/create-contest/create-contest.component';
import { SharedModule } from './shared/shared.module';

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
    StatusComponent,
    CreateContestComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
