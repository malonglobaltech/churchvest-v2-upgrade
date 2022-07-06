import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';
import { OverviewComponent } from './components/overview/overview.component';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { MembershipJournalComponent } from './components/membership-journal/membership-journal.component';
import { FinancialJournalComponent } from './components/financial-journal/financial-journal.component';


@NgModule({
  declarations: [
    ReportingComponent,
    OverviewComponent,
    MembershipJournalComponent,
    FinancialJournalComponent
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    AngularMaterialModule,
    LoadingRollerModule
  ],
  exports: [ReportingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportingModule { }
