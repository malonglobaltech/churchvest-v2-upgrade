import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInAuthGuard } from '../services/login-auth-guard.guard';
import { AuthComponent } from './auth.component';
import { AccountVerifyComponent } from './components/account-verify/account-verify.component';
import { ChurchSetupComponent } from './components/church-setup/church-setup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [LoggedInAuthGuard],
    children: [
      {
        path: 'api/email/verify/:*/:*',
        component: AccountVerifyComponent,
        data: {
          title: 'ChurchVest - Account Verification',
        },
      },
      {
        path: 'church-setup',
        component: ChurchSetupComponent,
        data: {
          title: 'ChurchVest - Church Setup',
        },
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'ChurchVest - Login',
        },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
          title: 'ChurchVest - Forgot Password',
        },
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
          title: 'ChurchVest - Create Account',
        },
      },
      {
        path: 'reset-password/:token',
        component: ForgotPasswordComponent,
        data: {
          title: 'ChurchVest - Reset Your Password',
        },
      },
      {
        path: 'verify-email',
        component: VerifyEmailComponent,
        data: {
          title: 'ChurchVest - Email Verification',
        },
      },

      {
        path: '',
        redirectTo: 'login',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
