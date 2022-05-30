import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMembersComponent } from './components/add-members/add-members.component';
import { MembersComponent } from './components/members/members.component';
import { SummaryComponent } from './components/summary/summary.component';
import { TrashedMembersComponent } from './components/trashed-members/trashed-members.component';
import { PeopleComponent } from './people.component';

const routes: Routes = [
  {
    path: '',
    component: PeopleComponent,
    children: [
      {
        path: 'add-member',
        component: AddMembersComponent,
      },
      {
        path: 'members',
        component: MembersComponent,
      },
      {
        path: 'summary',
        component: SummaryComponent,
      },
      {
        path: 'trashed-members',
        component: TrashedMembersComponent,
      },
      {
        path: '**',
        redirectTo: 'members',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRoutingModule {}
