import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialJournalComponent } from './components/financial-journal/financial-journal.component';
import { MembershipJournalComponent } from './components/membership-journal/membership-journal.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ReportingComponent } from './reporting.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'financial-journal',
        component: FinancialJournalComponent,
      },
      {
        path: 'membership-journal',
        component: MembershipJournalComponent,
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
