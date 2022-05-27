import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth-guard.guard';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'activity',
        loadChildren: () =>
          import('../pages/activity/activity.module').then(
            (m) => m.ActivityModule
          ),
      },
      {
        path: '',
        redirectTo: 'activity',
      },
      {
        path: '**',
        redirectTo: 'activity',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}