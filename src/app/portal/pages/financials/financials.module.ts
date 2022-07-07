import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialsRoutingModule } from './financials-routing.module';
import { FinancialsComponent } from './financials.component';
import { SummaryComponent } from './components/summary/summary.component';
import { IncomeComponent } from './components/income/income.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { SettingsComponent } from './components/settings/settings.component';
import { ChartGraphModule } from '../../components/chart-graph/chart-graph.module';

@NgModule({
  declarations: [
    FinancialsComponent,
    SummaryComponent,
    IncomeComponent,
    ExpensesComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    FinancialsRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingRollerModule,
    ChartGraphModule,
  ],
  exports: [FinancialsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FinancialsModule {}
