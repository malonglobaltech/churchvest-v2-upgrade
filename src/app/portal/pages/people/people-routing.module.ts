import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './components/summary/summary.component';
import { PeopleComponent } from './people.component';

const routes: Routes = [
  {
    path: '',
    component: PeopleComponent,
    children: [
      {
        path: 'summary',
        component: SummaryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRoutingModule {}
