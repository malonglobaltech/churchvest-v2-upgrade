import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { StatsOverviewComponent } from './components/stats-overview/stats-overview.component';
import { EventsComponent } from './components/events/events.component';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';
import { EmptyStateModule } from '../../components/empty-state/empty-state.module';

@NgModule({
  declarations: [ActivityComponent, StatsOverviewComponent, EventsComponent],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    AngularMaterialModule,
    LoadingRollerModule,
    EmptyStateModule,
  ],
  exports: [ActivityComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActivityModule {}
