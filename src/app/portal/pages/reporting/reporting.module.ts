import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';
import { OverviewComponent } from './components/overview/overview.component';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';


@NgModule({
  declarations: [
    ReportingComponent,
    OverviewComponent
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
