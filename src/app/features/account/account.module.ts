import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { LoginComponent } from '../../Components/login/login.component';
import { RegisterComponent } from '../../Components/register/register.component';
import { ForgetPasswordComponent } from '../../Components/forget-password/forget-password.component';
import { ResetPasswordComponent } from '../../Components/reset-password/reset-password.component';
import { ChangePasswordComponent } from '../../Components/change-password/change-password.component';
import { ProfileComponent } from '../../Components/profile/profile.component';
import { UpdateProfileComponent } from '../../Components/update-profile/update-profile.component';
import { ProtectedAuthGuard } from '../../Guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Sign in · X-Judge' },
  { path: 'register', component: RegisterComponent, title: 'Create account · X-Judge' },
  { path: 'forgetPassword', component: ForgetPasswordComponent, title: 'Forgot password · X-Judge' },
  { path: 'resetPassword', component: ResetPasswordComponent, title: 'Reset password · X-Judge' },
  { path: 'changePassword', component: ChangePasswordComponent, canActivate: [ProtectedAuthGuard] },
  { path: 'profile/:handle', component: ProfileComponent },
];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ProfileComponent,
    UpdateProfileComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class AccountModule {}
