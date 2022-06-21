import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainEventsRoutingModule } from './main-events-routing.module';
import { MainEventsComponent } from './main-events.component';
import { EventOverviewComponent } from './components/event-overview/event-overview.component';
import { AddEventwComponent } from './components/add-eventw/add-eventw.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingRollerModule } from '../../components/loading-roller/loading-roller.module';


@NgModule({
  declarations: [
    AddEventwComponent,
    EventOverviewComponent,
    MainEventsComponent,

  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    MainEventsRoutingModule,
    FormsModule,
    LoadingRollerModule,
    ReactiveFormsModule
  ],
  exports: [MainEventsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainEventsModule { }
