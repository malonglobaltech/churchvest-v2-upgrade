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
import { TrashedEvangelismComponent } from './components/trashed-evangelism/trashed-evangelism.component';
import { TrashedFellowshipsComponent } from './components/trashed-fellowships/trashed-fellowships.component';
import { TrashedMembersComponent } from './components/trashed-members/trashed-members.component';
import { PeopleComponent } from './people.component';

const routes: Routes = [
  {
    path: '',
    component: PeopleComponent,
    children: [
      {
        path: 'evangelism',
        component: EvangelismComponent,
      },
      {
        path: 'first-timers',
        component: FirstTimersComponent,
      },
      {
        path: 'house-fellowship',
        component: FellowshipComponent,
        pathMatch: 'full',
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
        path: 'evangelism/trash',
        component: TrashedEvangelismComponent,
      },
      {
        path: 'house-fellowship/trash',
        component: TrashedFellowshipsComponent,
      },
      {
        path: 'members/trash',
        component: TrashedMembersComponent,
      },
      {
        path: 'evangelism/:query',
        component: AddEvangelismComponent,
      },
      {
        path: 'first-timers/:query',
        component: AddFirstTimersComponent,
      },
      {
        path: 'house-fellowship/:query',
        component: AddFellowshipComponent,
      },
      {
        path: 'members/:query',
        component: AddMembersComponent,
      },
      {
        path: 'new-convert/:query',
        component: AddNewConvertsComponent,
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
