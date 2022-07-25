import { TrashComponent } from './components/trash/trash.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { IncomeComponent } from './components/income/income.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SummaryComponent } from './components/summary/summary.component';
import { FinancialsComponent } from './financials.component';

const routes: Routes = [
  {
    path: '',
    component: FinancialsComponent,
    children: [
      {
        path: 'summary',
        component: SummaryComponent,
      },
      {
        path: 'income',
        component: IncomeComponent,
      },
      {
        path: 'expenses',
        component: ExpensesComponent,
      },
      {
        path: 'trash',
        component: TrashComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: '**',
        redirectTo: 'summary',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialsRoutingModule {}
