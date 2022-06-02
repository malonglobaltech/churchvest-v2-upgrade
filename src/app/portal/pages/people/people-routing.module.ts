import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEvangelismComponent } from './components/add-evangelism/add-evangelism.component';
import { AddFellowshipComponent } from './components/add-fellowship/add-fellowship.component';
import { AddFirstTimersComponent } from './components/add-first-timers/add-first-timers.component';
import { AddMembersComponent } from './components/add-members/add-members.component';
import { AddNewConvertsComponent } from './components/add-new-converts/add-new-converts.component';
import { EvangelismComponent } from './components/evangelism/evangelism.component';
import { FellowshipComponent } from './components/fellowship/fellowship.component';
import { FirstTimersComponent } from './components/first-timers/first-timers.component';
import { MembersComponent } from './components/members/members.component';
import { NewConvertsComponent } from './components/new-converts/new-converts.component';
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
        path: 'add-evangelism',
        component: AddEvangelismComponent,
      },
      {
        path: 'add-fellowship',
        component: AddFellowshipComponent,
      },
      {
        path: 'add-new-converts',
        component: AddNewConvertsComponent,
      },
      {
        path: 'add-first-timers',
        component: AddFirstTimersComponent,
      },
      {
        path: 'evangelism',
        component: EvangelismComponent,
      },
      {
        path: 'house-fellowship',
        component: FellowshipComponent,
      },
      {
        path: 'first-timers',
        component: FirstTimersComponent,
      },
      {
        path: 'new-convert',
        component: NewConvertsComponent,
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
