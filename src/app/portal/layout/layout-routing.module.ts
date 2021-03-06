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
        path: 'department',
        loadChildren: () =>
          import('../pages/department/department.module').then(
            (m) => m.DepartmentModule
          ),
      },
      {
        path: 'more',
        loadChildren: () =>
          import('../pages/more/more.module').then((m) => m.MoreModule),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('../pages/events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'financials',
        loadChildren: () =>
          import('../pages/financials/financials.module').then(
            (m) => m.FinancialsModule
          ),
      },
      {
        path: 'people',
        loadChildren: () =>
          import('../pages/people/people.module').then((m) => m.PeopleModule),
      },
      {
        path: 'reporting',
        loadChildren: () => 
          import('../pages/reporting/reporting.module').then((m) => m.ReportingModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../pages/settings/settings.module').then(
            (m) => m.SettingsModule
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
