import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleAccessComponent } from './components/module-access/module-access.component';
import { OnlineGivingComponent } from './components/online-giving/online-giving.component';
import { OverviewComponent } from './components/overview/overview.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'module-access',
        component: ModuleAccessComponent,
      },
      {
        path: 'online-giving',
        component: OnlineGivingComponent,
      },
      {
        path: 'profile-settings',
        component: OverviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
